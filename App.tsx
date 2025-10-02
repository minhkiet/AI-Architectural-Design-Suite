import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { Feature, FeatureKey, RenderHistoryItem, RenderSettings } from './types';
import { translations } from './translations';

declare var XLSX: any; // Declare XLSX from CDN script

const features: Feature[] = [
  { key: FeatureKey.SURREAL_EXTERIOR, icon: 'fa-solid fa-tree-city', imageUpload: 'optional', outputType: 'image' },
  { key: FeatureKey.INSTANT_INTERIOR, icon: 'fa-solid fa-couch', imageUpload: 'required', outputType: 'image' },
  { key: FeatureKey.MASTER_PLAN, icon: 'fa-solid fa-map', imageUpload: 'required', outputType: 'image' },
  { key: FeatureKey.SMART_EDIT, icon: 'fa-solid fa-wand-magic-sparkles', imageUpload: 'required', outputType: 'image' },
  { key: FeatureKey.SKETCHUP_FINALIZE, icon: 'fa-solid fa-cube', imageUpload: 'required', outputType: 'image' },
  { key: FeatureKey.PLAN_TO_3D, icon: 'fa-solid fa-drafting-compass', imageUpload: 'required', outputType: 'image' },
  { key: FeatureKey.REAL_TO_TECH_DRAWING, icon: 'fa-solid fa-pen-ruler', imageUpload: 'required', outputType: 'image' },
  { key: FeatureKey.COST_CALCULATION, icon: 'fa-solid fa-calculator', imageUpload: 'optional', outputType: 'text' },
  { key: FeatureKey.TASK_GENERATOR, icon: 'fa-solid fa-list-check', imageUpload: 'optional', outputType: 'text' },
];

const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [, base64Data] = result.split(',');
      const mimeType = result.substring(result.indexOf(':') + 1, result.indexOf(';'));
      resolve({ data: base64Data, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};

const dataUrlToParts = (dataUrl: string): { data: string; mimeType: string } => {
    const [, base64Data] = dataUrl.split(',');
    const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
    return { data: base64Data, mimeType };
};

type Language = 'vi' | 'en';

interface ImageUploaderProps {
  label: string;
  imageUrl: string | null;
  onFileSelect: (file: File | null) => void;
  onClear: () => void;
  T: any; 
  styles: { [key: string]: React.CSSProperties };
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, imageUrl, onFileSelect, onClear, T, styles }) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileValidation = (file: File | null): boolean => {
        if (file && !file.type.startsWith('image/')) {
            console.warn("Invalid file type rejected:", file.type);
            return false;
        }
        return true;
    };

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if (isEntering) {
            if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
                setIsDragging(true);
            }
        } else {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (handleFileValidation(file)) {
                onFileSelect(file);
            }
            e.dataTransfer.clearData();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (handleFileValidation(file)) {
            onFileSelect(file);
        } else if (e.target) {
            e.target.value = ''; // Clear the input if the file is invalid
        }
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={styles.label}>{label}</label>
            <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} style={styles.fileInput} />
            
            {imageUrl ? (
                <div style={styles.imagePreviewContainer}>
                    <img src={imageUrl} alt="Uploaded preview" style={styles.imagePreview} />
                    <button onClick={() => { onClear(); if(fileInputRef.current) fileInputRef.current.value = ''; }} style={styles.clearButton} aria-label="Clear uploaded image">
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
            ) : (
                <div 
                    style={{...styles.dropzone, ...(isDragging ? styles.dropzoneActive : {})}}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={(e) => handleDragEvents(e, true)}
                    onDragLeave={(e) => handleDragEvents(e, false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <i className="fa-solid fa-cloud-arrow-up" style={styles.dropzoneIcon}></i>
                    <p style={styles.dropzoneText}>
                        {T.dropzoneLabel} <span style={styles.dropzoneBrowse}>{T.dropzoneBrowse}</span>
                    </p>
                    <p style={styles.dropzoneHelperText}>{T.dropzoneHelper}</p>
                </div>
            )}
        </div>
    );
};


const App: React.FC = () => {
  const [selectedFeatureKey, setSelectedFeatureKey] = useState<FeatureKey>(FeatureKey.SURREAL_EXTERIOR);
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [stylePreset, setStylePreset] = useState<string>('none');
  
  // Main image state
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  
  // Decal image state for Smart Edit
  const [decalImage, setDecalImage] = useState<File | null>(null);
  const [decalImageUrl, setDecalImageUrl] = useState<string | null>(null);
  
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedTextOutput, setGeneratedTextOutput] = useState<any | null>(null);
  const [history, setHistory] = useState<RenderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [detailLevel, setDetailLevel] = useState<string>('medium');
  const [language, setLanguage] = useState<Language>('vi');
  const [isStudioVisible, setIsStudioVisible] = useState<boolean>(false);

  // Prompt Suggestions State
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState<boolean>(false);

  // Task Generator State
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  const [workerCount, setWorkerCount] = useState<number>(5);
  const [dimensionLength, setDimensionLength] = useState<number | ''>('');
  const [dimensionWidth, setDimensionWidth] = useState<number | ''>('');
  const [dimensionHeight, setDimensionHeight] = useState<number | ''>('');
  
  // Tech Drawing State
  const [drawingScale, setDrawingScale] = useState<string>('1:100');
  const [lineThickness, setLineThickness] = useState<string>('medium');
  const [lineStyle, setLineStyle] = useState<string>('solid');
  const [symbolLibrary, setSymbolLibrary] = useState<string>('generic');

  // Image Refinement State
  const [isEditingOutput, setIsEditingOutput] = useState<boolean>(false);
  const [refinePrompt, setRefinePrompt] = useState<string>('');
  const [refineDecalImage, setRefineDecalImage] = useState<File | null>(null);
  const [refineDecalImageUrl, setRefineDecalImageUrl] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [refinedImageUrl, setRefinedImageUrl] = useState<string | null>(null);
  const [refineError, setRefineError] = useState<string | null>(null);

  const T = useMemo(() => translations[language], [language]);
  
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.REACT_APP_API_KEY! || process.env.API_KEY! }), []);
  const selectedFeature = features.find(f => f.key === selectedFeatureKey)!;
  const selectedFeatureText = T.features[selectedFeature.key];
  
  useEffect(() => {
    return () => {
      if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
      if (decalImageUrl) URL.revokeObjectURL(decalImageUrl);
      if (refineDecalImageUrl) URL.revokeObjectURL(refineDecalImageUrl);
    };
  }, [uploadedImageUrl, decalImageUrl, refineDecalImageUrl]);

  const generatePromptSuggestions = useCallback(async (imageFile: File, featureKey: FeatureKey) => {
    setIsGeneratingSuggestions(true);
    setPromptSuggestions([]);
    
    try {
      const { data, mimeType } = await fileToBase64(imageFile);
      
      const systemInstruction = T.suggestionPrompts[featureKey] || T.suggestionPrompts.default;
      const schema = {
        type: Type.OBJECT,
        properties: {
          suggestions: {
            type: Type.ARRAY,
            description: 'A list of 3-4 concise, creative, and relevant prompt suggestions.',
            items: { type: Type.STRING }
          }
        },
        required: ['suggestions']
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ inlineData: { data, mimeType } }] },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: schema,
        }
      });
      
      const textResponse = response.text.trim();
      const parsedJson = JSON.parse(textResponse);
      if (parsedJson.suggestions && Array.isArray(parsedJson.suggestions)) {
        setPromptSuggestions(parsedJson.suggestions);
      }

    } catch (e) {
      console.error("Failed to generate suggestions:", e);
      // Silently fail, don't show an error to the user for this feature
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }, [ai, T]);

  const processMainFile = (file: File | null) => {
    if (file) {
      if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
      setUploadedImage(file);
      setUploadedImageUrl(URL.createObjectURL(file));
      setGeneratedImageUrl(null);
      setGeneratedTextOutput(null);
      setError(null);
      // Trigger suggestion generation
      if (selectedFeature.imageUpload !== 'none') {
        generatePromptSuggestions(file, selectedFeature.key);
      }
    }
  };

  const processDecalFile = (file: File | null) => {
    if (file) {
        if (decalImageUrl) URL.revokeObjectURL(decalImageUrl);
        setDecalImage(file);
        setDecalImageUrl(URL.createObjectURL(file));
    }
  };

   const processRefineDecalFile = (file: File | null) => {
    if (file) {
        if (refineDecalImageUrl) URL.revokeObjectURL(refineDecalImageUrl);
        setRefineDecalImage(file);
        setRefineDecalImageUrl(URL.createObjectURL(file));
    }
  };

  const clearMainImage = () => {
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    setUploadedImage(null);
    setUploadedImageUrl(null);
    setPromptSuggestions([]);
  };
  
  const clearDecalImage = () => {
    if (decalImageUrl) URL.revokeObjectURL(decalImageUrl);
    setDecalImage(null);
    setDecalImageUrl(null);
  };

  const clearRefineDecalImage = () => {
    if (refineDecalImageUrl) URL.revokeObjectURL(refineDecalImageUrl);
    setRefineDecalImage(null);
    setRefineDecalImageUrl(null);
  };

  const selectFeature = (key: FeatureKey) => {
    setSelectedFeatureKey(key);
    setPrompt('');
    setNegativePrompt('');
    setStylePreset('none');
    setDetailLevel('medium');
    clearMainImage();
    clearDecalImage();
    setGeneratedImageUrl(null);
    setGeneratedTextOutput(null);
    setDimensionLength('');
    setDimensionWidth('');
    setDimensionHeight('');
    setPromptSuggestions([]);
    setIsGeneratingSuggestions(false);
    // Reset tech drawing options
    setDrawingScale('1:100');
    setLineThickness('medium');
    setLineStyle('solid');
    setSymbolLibrary('generic');
    setError(null);
  };

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);
    setGeneratedTextOutput(null);

    if (!prompt) {
      setError(T.errors.promptRequired);
      setIsLoading(false);
      return;
    }
    
    try {
      let resultImageUrl: string;
      
      // Special case for Smart Edit with two images
      if (selectedFeature.key === FeatureKey.SMART_EDIT) {
          if (!uploadedImage || !decalImage) {
              setError(T.errors.bothImagesRequired);
              setIsLoading(false);
              return;
          }
          const { data: mainData, mimeType: mainMime } = await fileToBase64(uploadedImage);
          const { data: decalData, mimeType: decalMime } = await fileToBase64(decalImage);
          
          const fullPrompt = `Using the second image as a decal/detail/texture, modify the first image according to the instruction: "${prompt}"`;

          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image-preview',
              contents: { 
                  parts: [
                      { inlineData: { data: mainData, mimeType: mainMime } },
                      { inlineData: { data: decalData, mimeType: decalMime } },
                      { text: fullPrompt }
                  ] 
              },
              config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
          });
          const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
          if (!imagePart?.inlineData) throw new Error(T.errors.noImageGenerated);
          resultImageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

      } else if (selectedFeature.outputType === 'text') { // Text output features
        let schema, systemInstruction;
        
        if (selectedFeature.key === FeatureKey.COST_CALCULATION) {
            schema = {
                type: Type.OBJECT,
                properties: {
                    currency: { type: Type.STRING, description: 'Currency code, e.g., USD or VND' },
                    summary: {
                        type: Type.OBJECT,
                        properties: {
                            total_area: { type: Type.NUMBER, description: 'Total estimated area in square meters.' },
                            total_cost: { type: Type.NUMBER, description: 'Total estimated cost.' }
                        },
                        required: ['total_area', 'total_cost']
                    },
                    breakdown: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                item: { type: Type.STRING, description: 'Name of the cost item (e.g., Foundation, Structure).' },
                                cost: { type: Type.NUMBER, description: 'Estimated cost for this item.' },
                                details: { type: Type.STRING, description: 'Brief details or assumptions for this item.' }
                            },
                            required: ['item', 'cost', 'details']
                        }
                    }
                },
                required: ['currency', 'summary', 'breakdown']
            };
            systemInstruction = `You are an expert construction cost estimator. Analyze the user's prompt (and optional image) to provide a preliminary cost and size analysis for the architectural project. Respond in the user's language (${language}). Provide costs in Vietnamese Dong (VND) if the language is Vietnamese, otherwise use US Dollars (USD).`;
        } else if (selectedFeature.key === FeatureKey.TASK_GENERATOR) {
            schema = {
                type: Type.OBJECT,
                properties: {
                    projectName: { type: Type.STRING, description: 'The name of the project.' },
                    workerBreakdown: {
                        type: Type.ARRAY,
                        description: 'A list of tasks broken down by worker type.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                workerType: { type: Type.STRING, description: 'The type of worker (e.g., Mason, Painter, Helper, Ironworker).' },
                                estimatedWorkers: { type: Type.NUMBER, description: 'The estimated number of workers of this type needed.' },
                                tasks: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            taskName: { type: Type.STRING, description: 'The name or description of the task.' },
                                            priority: { type: Type.STRING, description: 'Priority level (e.g., High, Medium, Low).' },
                                            timeframe: { type: Type.STRING, description: 'Suggested timeline, duration, or due date for the task (e.g., "Week 1", "3 days", "End of Q4", "2024-12-25").' }
                                        },
                                        required: ['taskName', 'priority', 'timeframe']
                                    }
                                }
                            },
                            required: ['workerType', 'estimatedWorkers', 'tasks']
                        }
                    }
                },
                required: ['projectName', 'workerBreakdown']
            };
            let dimensionText = '';
            if (dimensionLength && dimensionWidth && dimensionHeight) {
                dimensionText = ` The project has the following dimensions: ${dimensionLength}m (length) x ${dimensionWidth}m (width) x ${dimensionHeight}m (height).`;
            } else if (dimensionLength && dimensionWidth) {
                dimensionText = ` The project has the following dimensions: ${dimensionLength}m (length) x ${dimensionWidth}m (width).`;
            }
            systemInstruction = `You are an expert project manager for architectural projects. Analyze the user's prompt and the provided technical drawing/image to generate a structured list of tasks.${dimensionText} The project must start on ${startDate}, end by ${endDate}, and be completed by a team of approximately ${workerCount} workers. Use the image and dimensions to make the task breakdown more accurate. Break down the tasks by worker type (e.g., Mason, Painter, Helper, Ironworker). For each task, provide a flexible timeline, which could be a duration (e.g., '3 days'), a phase (e.g., 'Week 2'), or a specific due date. Respond in the user's language (${language}).`;
        }
        
        const parts: any[] = [{ text: prompt }];
        if (selectedFeature.imageUpload === 'optional' && uploadedImage) {
            const { data, mimeType } = await fileToBase64(uploadedImage);
            parts.unshift({ inlineData: { data, mimeType } });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts },
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: schema,
          }
        });
        
        const textResponse = response.text.trim();
        const parsedJson = JSON.parse(textResponse);
        setGeneratedTextOutput(parsedJson);
        setIsLoading(false);
        return; // Exit early for text output

      } else { // All other image generation features
        if (selectedFeature.imageUpload === 'required' && !uploadedImage) {
          setError(T.errors.imageRequired);
          setIsLoading(false);
          return;
        }

        if (selectedFeature.imageUpload !== 'none' && uploadedImage) { // Image-to-image
          let finalPrompt = prompt;
          const prefix = T.promptPrefixes.image_to_image[selectedFeature.key];
          if (prefix) {
              finalPrompt = `${prefix} ${prompt}`;
          }
          
          if (selectedFeature.key === FeatureKey.REAL_TO_TECH_DRAWING) {
            const techSpec = T.techDrawingSpecifications({
                scale: drawingScale,
                thickness: T.techDrawingOptions.lineThickness.options[lineThickness],
                style: T.techDrawingOptions.lineStyle.options[lineStyle],
                library: T.techDrawingOptions.symbolLibrary.options[symbolLibrary]
            });
            finalPrompt = `${finalPrompt}. ${techSpec}`;
          }

          const { data, mimeType } = await fileToBase64(uploadedImage);
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [{ inlineData: { data, mimeType } }, { text: finalPrompt }] },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
          });
          const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
          if (!imagePart?.inlineData) throw new Error(T.errors.noImageGenerated);
          resultImageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        } else { // Text-to-image
          let finalPrompt = prompt;
          if (stylePreset !== 'none') {
              const stylePrefixes: { [key: string]: string } = { photorealistic: 'A photorealistic, hyper-detailed photograph of', cartoon: 'A vibrant cartoon-style illustration of', impressionist: 'An impressionist painting of', digital_art: 'A digital art piece of', cinematic: 'A cinematic, dramatic, wide-angle shot of' };
              if (stylePrefixes[stylePreset]) finalPrompt = `${stylePrefixes[stylePreset]} ${prompt}`;
          }
          const detailSuffixes: { [key: string]: string } = { low: ', simple, low detail', high: ', intricate details, hyper-detailed, sharp focus' };
          if (detailSuffixes[detailLevel]) finalPrompt += detailSuffixes[detailLevel];

          const config: any = { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: aspectRatio };
          if (negativePrompt.trim() !== '') config.negativePrompt = negativePrompt;

          const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: finalPrompt,
            config,
          });

          if (!response.generatedImages || response.generatedImages.length === 0) throw new Error(T.errors.noImageGenerated);
          resultImageUrl = `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
        }
      }

      setGeneratedImageUrl(resultImageUrl);

      const currentSettings: RenderSettings = {
        negativePrompt,
        stylePreset,
        aspectRatio,
        detailLevel,
        drawingScale,
        lineThickness,
        lineStyle,
        symbolLibrary,
        startDate,
        endDate,
        workerCount,
        dimensionLength,
        dimensionWidth,
        dimensionHeight,
      };

      const newHistoryItem: RenderHistoryItem = {
        id: new Date().toISOString(),
        featureKey: selectedFeature.key,
        featureTitle: T.features[selectedFeature.key].title,
        prompt: prompt,
        imageUrl: resultImageUrl,
        timestamp: new Date().toLocaleString(language),
        settings: currentSettings,
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (e) {
      console.error(e);
      setError(T.errors.general(e instanceof Error ? e.message : String(e)));
    } finally {
      setIsLoading(false);
    }
  }, [prompt, uploadedImage, decalImage, selectedFeature, ai, aspectRatio, T, language, negativePrompt, stylePreset, detailLevel, startDate, endDate, workerCount, dimensionLength, dimensionWidth, dimensionHeight, drawingScale, lineThickness, lineStyle, symbolLibrary]);

  const handleRefineImage = async () => {
    if (!refinePrompt || !generatedImageUrl) {
        setRefineError(T.errors.promptRequired);
        return;
    }
    setIsRefining(true);
    setRefineError(null);

    try {
        const parts: any[] = [];
        const mainImageParts = dataUrlToParts(generatedImageUrl);
        parts.push({ inlineData: { data: mainImageParts.data, mimeType: mainImageParts.mimeType } });

        if (refineDecalImage) {
            const { data: decalData, mimeType: decalMime } = await fileToBase64(refineDecalImage);
            parts.push({ inlineData: { data: decalData, mimeType: decalMime } });
        }
        parts.push({ text: refinePrompt });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!imagePart?.inlineData) throw new Error(T.errors.noImageGenerated);
        
        const newImageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        setRefinedImageUrl(newImageUrl);

    } catch (e) {
        console.error(e);
        setRefineError(T.errors.general(e instanceof Error ? e.message : String(e)));
    } finally {
        setIsRefining(false);
    }
  };

  const closeAndResetEditModal = () => {
    setIsEditingOutput(false);
    setRefinePrompt('');
    clearRefineDecalImage();
    setRefinedImageUrl(null);
    setIsRefining(false);
    setRefineError(null);
  };

  const handleSaveChanges = () => {
      if (refinedImageUrl && history.length > 0) {
          setGeneratedImageUrl(refinedImageUrl);
          const latestHistoryItem = history[0];
          const updatedHistoryItem = { 
              ...latestHistoryItem, 
              imageUrl: refinedImageUrl,
              prompt: `${latestHistoryItem.prompt}\n\n[${T.refinedLabel}]: ${refinePrompt}`
          };
          setHistory([updatedHistoryItem, ...history.slice(1)]);
          closeAndResetEditModal();
      }
  };

  const handleTryAgain = () => {
      setRefinedImageUrl(null);
      setRefineError(null);
  };

  const handleRerun = (item: RenderHistoryItem) => {
    // Switch to the correct feature, which also resets unrelated state
    selectFeature(item.featureKey);
    
    // Set state based on the history item's saved settings
    setPrompt(item.prompt);
    
    const settings = item.settings || {};
    // Text-to-image settings
    setNegativePrompt(settings.negativePrompt || '');
    setStylePreset(settings.stylePreset || 'none');
    setAspectRatio(settings.aspectRatio || '1:1');
    setDetailLevel(settings.detailLevel || 'medium');
    
    // Tech Drawing settings
    setDrawingScale(settings.drawingScale || '1:100');
    setLineThickness(settings.lineThickness || 'medium');
    setLineStyle(settings.lineStyle || 'solid');
    setSymbolLibrary(settings.symbolLibrary || 'generic');
    
    // Task Generator settings
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setStartDate(settings.startDate || today);
    setEndDate(settings.endDate || thirtyDaysFromNow);
    setWorkerCount(settings.workerCount || 5);
    setDimensionLength(settings.dimensionLength ?? '');
    setDimensionWidth(settings.dimensionWidth ?? '');
    setDimensionHeight(settings.dimensionHeight ?? '');

    // Note: We don't restore the uploaded image as it's not stored.
    // The user will need to re-upload it if the feature requires one.
    
    // Scroll to top to bring focus to the input panel
    window.scrollTo(0, 0);
  };

  const handleExportCostsToExcel = (data: any) => {
    if (typeof XLSX === 'undefined') {
      console.error("XLSX library is not loaded.");
      setError(T.errors.general("Excel export library not found."));
      return;
    }

    const sheetData = [
      [T.costAnalysisTitle],
      [],
      [T.totalArea, data.summary.total_area, 'm²'],
      [T.totalCost, data.summary.total_cost, data.currency],
      [],
      [T.costTableHeaders.item, T.costTableHeaders.cost, T.costTableHeaders.details]
    ];

    data.breakdown.forEach((row: any) => {
        sheetData.push([row.item, row.cost, row.details]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet["!cols"] = [
        { wch: 30 }, { wch: 20 }, { wch: 50 }
    ];
    worksheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, T.costAnalysisTitle);

    XLSX.writeFile(workbook, `cost-analysis.xlsx`);
  };

  const handleExportTasksToExcel = (data: any) => {
    if (typeof XLSX === 'undefined') {
      console.error("XLSX library is not loaded.");
      setError(T.errors.general("Excel export library not found."));
      return;
    }

    const flattenedTasks: any[] = [];
    data.workerBreakdown.forEach((group: any) => {
      group.tasks.forEach((task: any) => {
        flattenedTasks.push({
          [T.taskTableHeaders.workerType]: group.workerType,
          [T.taskTableHeaders.estimatedWorkers]: group.estimatedWorkers,
          [T.taskTableHeaders.task]: task.taskName,
          [T.taskTableHeaders.priority]: task.priority,
          [T.taskTableHeaders.timeframe]: task.timeframe,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedTasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    
    // Auto-fit columns
    const max_width = flattenedTasks.reduce((w, r) => Math.max(w, r[T.taskTableHeaders.task].length), 10);
    worksheet["!cols"] = [ { wch: 20 }, { wch: 15 }, { wch: max_width }, { wch: 15 }, { wch: 20 } ];

    XLSX.writeFile(workbook, `${data.projectName?.replace(/ /g, '_') || 'project'}-tasks.xlsx`);
  };

  const renderTextOutput = (data: any) => (
    <div style={styles.textOutputContainer} className="animate-fade-in">
        <div style={styles.textOutputHeader}>
            <h3 style={{...styles.textOutputTitle, margin: 0, border: 'none', padding: 0}}>{T.costAnalysisTitle}</h3>
            <button onClick={() => handleExportCostsToExcel(data)} style={styles.exportButton}>
              <i className="fa-solid fa-file-excel" style={{ marginRight: '8px' }}></i>
              {T.exportToExcel}
            </button>
        </div>
        {data.summary && (
            <div style={styles.summaryBox}>
                <div><strong>{T.totalArea}:</strong> {data.summary.total_area?.toLocaleString(language)} m²</div>
                <div><strong>{T.totalCost}:</strong> {new Intl.NumberFormat(language, { style: 'currency', currency: data.currency || 'USD' }).format(data.summary.total_cost)}</div>
            </div>
        )}
        {data.breakdown && (
            <table style={styles.costTable}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>{T.costTableHeaders.item}</th>
                        <th style={styles.tableHeader}>{T.costTableHeaders.cost}</th>
                        <th style={styles.tableHeader}>{T.costTableHeaders.details}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.breakdown.map((row: any, index: number) => (
                        <tr key={index}>
                            <td style={styles.tableCell}>{row.item}</td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>{new Intl.NumberFormat(language, { style: 'currency', currency: data.currency || 'USD' }).format(row.cost)}</td>
                            <td style={styles.tableCell}>{row.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
  );

  const renderTaskOutput = (data: any) => (
    <div style={styles.textOutputContainer} className="animate-fade-in">
        <div style={styles.textOutputHeader}>
          <h3 style={{...styles.textOutputTitle, margin: 0, border: 'none', padding: 0}}>{T.taskAnalysisTitle}: {data.projectName}</h3>
          <button onClick={() => handleExportTasksToExcel(data)} style={styles.exportButton}>
            <i className="fa-solid fa-file-excel" style={{ marginRight: '8px' }}></i>
            {T.exportToExcel}
          </button>
        </div>
        {data.workerBreakdown && data.workerBreakdown.map((breakdown: any, index: number) => (
            <div key={index} style={{ marginTop: '24px' }}>
                <h4 style={styles.workerTypeTitle}>
                    {breakdown.workerType} 
                    <span style={styles.workerCountChip}>{T.workerCountLabel}: {breakdown.estimatedWorkers}</span>
                </h4>
                <table style={styles.costTable}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>{T.taskTableHeaders.task}</th>
                            <th style={styles.tableHeader}>{T.taskTableHeaders.priority}</th>
                            <th style={styles.tableHeader}>{T.taskTableHeaders.timeframe}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {breakdown.tasks.map((task: any, taskIndex: number) => (
                            <tr key={taskIndex}>
                                <td style={styles.tableCell}>{task.taskName}</td>
                                <td style={styles.tableCell}>{task.priority}</td>
                                <td style={styles.tableCell}>{task.timeframe}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ))}
    </div>
  );
  
  if (!isStudioVisible) {
    return (
        <div style={styles.homePageContainer}>
            <div style={styles.homeContentWrapper}>
                <div style={styles.homeContent}>
                    <header style={styles.homeHeader}>
                        <div style={styles.langSwitcherHome}>
                          <button onClick={() => setLanguage('vi')} style={language === 'vi' ? styles.langButtonActive : styles.langButton}>VI</button>
                          <button onClick={() => setLanguage('en')} style={language === 'en' ? styles.langButtonActive : styles.langButton}>EN</button>
                        </div>
                        <i className="fa-solid fa-drafting-compass" style={styles.homeMainIcon}></i>
                        <h1 style={styles.homeTitle}>{T.homeTitle}</h1>
                        <p style={styles.homeSubtitle}>{T.homeSubtitle}</p>
                    </header>
                    <div style={styles.servicesGrid}>
                        {features.map(feature => {
                            const featureText = T.features[feature.key];
                            return (
                                <div key={feature.key} style={styles.serviceCard} onClick={() => { selectFeature(feature.key); setIsStudioVisible(true); }}>
                                    <div style={styles.serviceCardIconWrapper}>
                                        <i className={feature.icon} style={styles.serviceCardIcon}></i>
                                    </div>
                                    <h3 style={styles.serviceCardTitle}>{featureText.title}</h3>
                                    <p style={styles.serviceCardDescription}>{T.tooltips[feature.key]}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <footer style={styles.footer}>{T.footerText}</footer>
        </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
            <i className="fa-solid fa-drafting-compass" style={{ fontSize: '24px', color: '#63b3ed' }}></i>
            <h1 style={styles.logo}>{T.logo}</h1>
        </div>
        <nav>
          <ul style={styles.navList}>
            {features.map(feature => {
                const isSelected = selectedFeatureKey === feature.key;
                const featureText = T.features[feature.key];
                return (
                  <li key={feature.key}
                      className="tooltip-container tooltip-right"
                      data-tooltip={T.tooltips[feature.key]}
                      onClick={() => selectFeature(feature.key)}
                      style={{...styles.navItem, ...(isSelected ? styles.navItemSelected : {})}}>
                    <i className={feature.icon} style={{...styles.navIcon, color: isSelected ? '#fff' : '#a0aec0' }}></i>
                    <span style={{color: isSelected ? '#fff' : '#e2e8f0' }}>{featureText.title}</span>
                  </li>
                );
            })}
          </ul>
        </nav>
      </aside>

      <main style={styles.mainContent}>
        <header style={styles.mainHeader}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <button onClick={() => setIsStudioVisible(false)} style={styles.backButton} className="tooltip-container tooltip-top" data-tooltip={T.backToHome}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div>
              <h2 style={styles.mainTitle}>{selectedFeatureText.title}</h2>
              <p style={styles.mainDescription}>{selectedFeatureText.description}</p>
            </div>
          </div>
          <div style={styles.langSwitcher}>
            <button onClick={() => setLanguage('vi')} style={language === 'vi' ? styles.langButtonActive : styles.langButton}>VI</button>
            <button onClick={() => setLanguage('en')} style={language === 'en' ? styles.langButtonActive : styles.langButton}>EN</button>
          </div>
        </header>

        <div style={styles.contentArea}>
          <div style={styles.inputPanel}>
              <div style={styles.inputGroup}>
                {selectedFeature.key === FeatureKey.SMART_EDIT ? (
                  <>
                    <ImageUploader label={T.mainImageLabel} imageUrl={uploadedImageUrl} onFileSelect={processMainFile} onClear={clearMainImage} T={T} styles={styles} />
                    <ImageUploader label={T.decalImageLabel} imageUrl={decalImageUrl} onFileSelect={processDecalFile} onClear={clearDecalImage} T={T} styles={styles} />
                  </>
                ) : selectedFeature.imageUpload !== 'none' ? (
                    <ImageUploader label={selectedFeatureText.imageUploadLabel} imageUrl={uploadedImageUrl} onFileSelect={processMainFile} onClear={clearMainImage} T={T} styles={styles} />
                ) : null}


                <label htmlFor="prompt-input" style={styles.label}>{T.promptLabel}</label>
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder={selectedFeatureText.promptPlaceholder}
                  rows={5}
                  style={styles.textarea}
                />
                
                {(isGeneratingSuggestions || promptSuggestions.length > 0) && (
                    <div style={styles.suggestionsContainer}>
                        {isGeneratingSuggestions ? (
                            <p style={styles.suggestionsLoader}>{T.analyzingForSuggestions}</p>
                        ) : (
                            promptSuggestions.map((suggestion, index) => (
                                <button key={index} onClick={() => setPrompt(suggestion)} style={styles.suggestionButton}>
                                    {suggestion}
                                </button>
                            ))
                        )}
                    </div>
                )}
                
                {selectedFeature.key === FeatureKey.REAL_TO_TECH_DRAWING && (
                  <div style={styles.optionsGroup}>
                    <label style={styles.groupLabel}>{T.techDrawingOptions.groupLabel}</label>
                    <div style={styles.optionsGrid}>
                      <div>
                        <label htmlFor="drawing-scale-input" style={styles.label}>{T.techDrawingOptions.drawingScale.label}</label>
                        <input id="drawing-scale-input" type="text" value={drawingScale} onChange={e => setDrawingScale(e.target.value)} style={styles.textInput} placeholder={T.techDrawingOptions.drawingScale.placeholder} />
                      </div>
                      <div>
                        <label htmlFor="line-thickness-select" style={styles.label}>{T.techDrawingOptions.lineThickness.label}</label>
                        <select id="line-thickness-select" value={lineThickness} onChange={e => setLineThickness(e.target.value)} style={styles.select}>
                          <option value="thin">{T.techDrawingOptions.lineThickness.options.thin}</option>
                          <option value="medium">{T.techDrawingOptions.lineThickness.options.medium}</option>
                          <option value="thick">{T.techDrawingOptions.lineThickness.options.thick}</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="line-style-select" style={styles.label}>{T.techDrawingOptions.lineStyle.label}</label>
                        <select id="line-style-select" value={lineStyle} onChange={e => setLineStyle(e.target.value)} style={styles.select}>
                          <option value="solid">{T.techDrawingOptions.lineStyle.options.solid}</option>
                          <option value="dashed">{T.techDrawingOptions.lineStyle.options.dashed}</option>
                          <option value="dotted">{T.techDrawingOptions.lineStyle.options.dotted}</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="symbol-library-select" style={styles.label}>{T.techDrawingOptions.symbolLibrary.label}</label>
                        <select id="symbol-library-select" value={symbolLibrary} onChange={e => setSymbolLibrary(e.target.value)} style={styles.select}>
                          <option value="generic">{T.techDrawingOptions.symbolLibrary.options.generic}</option>
                          <option value="ansi">{T.techDrawingOptions.symbolLibrary.options.ansi}</option>
                          <option value="iso">{T.techDrawingOptions.symbolLibrary.options.iso}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFeature.key === FeatureKey.TASK_GENERATOR && (
                  <>
                    <div style={{ marginTop: '20px' }}>
                      <label htmlFor="start-date-input" style={styles.label}>{T.startDateLabel}</label>
                      <input id="start-date-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={styles.textInput} />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <label htmlFor="end-date-input" style={styles.label}>{T.endDateLabel}</label>
                      <input id="end-date-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={styles.textInput} />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <label htmlFor="worker-count-input" style={styles.label}>{T.workerCountLabel}</label>
                      <input id="worker-count-input" type="number" value={workerCount} onChange={e => setWorkerCount(parseInt(e.target.value, 10) || 1)} min="1" style={styles.textInput} />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <label style={styles.label}>{T.dimensionsLabel}</label>
                        <div style={styles.dimensionInputsContainer}>
                            <input type="number" value={dimensionLength} onChange={e => setDimensionLength(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder={T.dimensionPlaceholders.length} style={styles.dimensionInput} />
                            <span>x</span>
                            <input type="number" value={dimensionWidth} onChange={e => setDimensionWidth(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder={T.dimensionPlaceholders.width} style={styles.dimensionInput} />
                            <span>x</span>
                            <input type="number" value={dimensionHeight} onChange={e => setDimensionHeight(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder={T.dimensionPlaceholders.height} style={styles.dimensionInput} />
                            <span style={{marginLeft: '4px'}}> (m)</span>
                        </div>
                    </div>
                  </>
                )}

                {selectedFeature.outputType === 'image' && !uploadedImageUrl && (
                  <>
                    <div style={{ marginTop: '20px' }} className="tooltip-container tooltip-top" data-tooltip={T.tooltips.stylePreset}>
                      <label htmlFor="style-preset-select" style={styles.label}>{T.stylePresetLabel}</label>
                      <select id="style-preset-select" value={stylePreset} onChange={e => setStylePreset(e.target.value)} style={styles.select}>
                        <option value="none">{T.stylePresets.none}</option>
                        <option value="photorealistic">{T.stylePresets.photorealistic}</option>
                        <option value="cartoon">{T.stylePresets.cartoon}</option>
                        <option value="impressionist">{T.stylePresets.impressionist}</option>
                        <option value="digital_art">{T.stylePresets.digital_art}</option>
                        <option value="cinematic">{T.stylePresets.cinematic}</option>
                      </select>
                    </div>

                    <div style={{ marginTop: '20px' }} className="tooltip-container tooltip-top" data-tooltip={T.tooltips.negativePrompt}>
                      <label htmlFor="negative-prompt-input" style={styles.label}>{T.negativePromptLabel}</label>
                      <textarea
                        id="negative-prompt-input"
                        value={negativePrompt}
                        onChange={e => setNegativePrompt(e.target.value)}
                        placeholder={T.negativePromptPlaceholder}
                        rows={3}
                        style={styles.textarea}
                      />
                    </div>
                  
                    <div style={{ marginTop: '20px' }} className="tooltip-container tooltip-top" data-tooltip={T.tooltips.aspectRatio}>
                      <label htmlFor="aspect-ratio-select" style={styles.label}>{T.aspectRatioLabel}</label>
                      <select id="aspect-ratio-select" value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} style={styles.select}>
                        <option value="1:1">{T.aspectRatio.square}</option>
                        <option value="16:9">{T.aspectRatio.widescreen}</option>
                        <option value="9:16">{T.aspectRatio.portrait}</option>
                        <option value="4:3">{T.aspectRatio.standard}</option>
                        <option value="3:4">{T.aspectRatio.tall}</option>
                      </select>
                    </div>

                    <div style={{ marginTop: '20px' }} className="tooltip-container tooltip-top" data-tooltip={T.tooltips.detailLevel}>
                      <label htmlFor="detail-level-select" style={styles.label}>{T.detailLevelLabel}</label>
                      <select id="detail-level-select" value={detailLevel} onChange={e => setDetailLevel(e.target.value)} style={styles.select}>
                        <option value="low">{T.detailLevels.low}</option>
                        <option value="medium">{T.detailLevels.medium}</option>
                        <option value="high">{T.detailLevels.high}</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <button onClick={handleGenerate} disabled={isLoading} style={{...styles.generateButton, ...(isLoading ? styles.generateButtonDisabled : {})}}>
                  {isLoading ? T.generatingButton : T.generateButton}
                </button>
                {error && <p style={styles.errorText}>{error}</p>}
              </div>
          </div>

          <div style={styles.outputPanel}>
            {isLoading ? (
              <>
                <div className="loader"></div>
                <p style={styles.loaderText}>{T.loaderText}</p>
              </>
            ) : generatedImageUrl ? (
              <div style={styles.generatedImageContainer}>
                <img src={generatedImageUrl} alt="Generated result" className="animate-fade-in" style={styles.generatedImage} />
                <div style={styles.imageActionsWrapper}>
                    <button
                        onClick={() => setIsEditingOutput(true)}
                        style={styles.editButton}
                        className="tooltip-container tooltip-top"
                        data-tooltip={T.editImage}
                        aria-label={T.editImage}
                        >
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </button>
                    <a
                      href={generatedImageUrl}
                      download="arch-ai-render.jpg"
                      style={styles.downloadButton}
                      className="tooltip-container tooltip-top"
                      data-tooltip={T.downloadImage}
                      aria-label={T.downloadImage}
                    >
                      <i className="fa-solid fa-download"></i>
                    </a>
                </div>
              </div>
            ) : generatedTextOutput ? (
              <>
                {selectedFeature.key === FeatureKey.COST_CALCULATION && renderTextOutput(generatedTextOutput)}
                {selectedFeature.key === FeatureKey.TASK_GENERATOR && renderTaskOutput(generatedTextOutput)}
              </>
            ) : (
              <p style={styles.placeholderText}>{T.outputPlaceholder}</p>
            )}
          </div>
        </div>
         <footer style={{...styles.footer, padding: '24px 0 0 0' }}>{T.footerText}</footer>

        {isEditingOutput && generatedImageUrl && (
            <div style={styles.editModalOverlay}>
                <div style={styles.editModalContent} className="animate-fade-in">
                    <div style={styles.editModalHeader}>
                        <h3 style={styles.editModalTitle}>{T.refineImageTitle}</h3>
                        <button onClick={closeAndResetEditModal} style={styles.editModalCloseButton} aria-label={T.closeButton}>
                          <i className="fa-solid fa-times"></i>
                        </button>
                    </div>

                    {isRefining ? (
                        <div style={styles.editModalBody}>
                            <div style={styles.editModalLoader}>
                                <div className="loader"></div>
                                <p style={styles.loaderText}>{T.refiningButton}</p>
                            </div>
                        </div>
                    ) : refinedImageUrl ? (
                        <div style={styles.editModalBody}>
                            <img src={refinedImageUrl} alt={T.refinedImageAlt} style={styles.refinedImagePreview} />
                             {refineError && <p style={styles.errorText}>{refineError}</p>}
                            <div style={styles.editModalActions}>
                                <button onClick={handleSaveChanges} style={{...styles.generateButton, backgroundColor: '#2f855a' }}>{T.saveAndReplace}</button>
                                <button onClick={handleTryAgain} style={{...styles.generateButton, backgroundColor: '#4a5568' }}>{T.tryAgain}</button>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.editModalBody}>
                            <ImageUploader label={T.refineDecalLabel} imageUrl={refineDecalImageUrl} onFileSelect={processRefineDecalFile} onClear={clearRefineDecalImage} T={T} styles={styles} />
                            <label htmlFor="refine-prompt-input" style={styles.label}>{T.refinePromptLabel}</label>
                            <textarea
                                id="refine-prompt-input"
                                value={refinePrompt}
                                onChange={e => setRefinePrompt(e.target.value)}
                                placeholder={T.refinePromptPlaceholder}
                                rows={4}
                                style={styles.textarea}
                            />
                            {refineError && <p style={styles.errorText}>{refineError}</p>}
                            <div style={styles.editModalActions}>
                                <button onClick={handleRefineImage} disabled={!refinePrompt} style={styles.generateButton}>
                                    {T.refineButton}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
      </main>

      <aside style={styles.historyPanel}>
        <h3 style={styles.historyTitle}>{T.historyTitle}</h3>
        {history.length === 0 ? (
          <p style={styles.placeholderText}>{T.historyPlaceholder}</p>
        ) : (
          <ul style={styles.historyList}>
            {history.map(item => (
              <li key={item.id} style={styles.historyItem}>
                <div style={styles.historyItemHeader}>
                    <h4 style={styles.historyItemTitle}>{item.featureTitle}</h4>
                    <small style={styles.historyItemTimestamp}>{item.timestamp}</small>
                </div>
                <img src={item.imageUrl} alt="History item" style={styles.historyImage}/>
                <div style={styles.historyItemDetails}>
                    <p style={styles.historyItemPrompt}>{item.prompt}</p>
                </div>
                <div style={styles.historyItemActions}>
                    <button 
                        style={styles.rerunButton}
                        onClick={() => handleRerun(item)}
                        className="tooltip-container tooltip-top"
                        data-tooltip={T.tooltips.rerunPrompt}
                        aria-label={T.tooltips.rerunPrompt}
                    >
                        <i className="fa-solid fa-rotate-right"></i>
                    </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    // --- START HOMEPAGE STYLES ---
    homePageContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#1a202c',
        boxSizing: 'border-box'
    },
    homeContentWrapper: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
    },
    homeContent: {
        width: '100%',
        maxWidth: '1200px',
        textAlign: 'center',
    },
    homeHeader: {
        marginBottom: '48px',
        position: 'relative'
    },
    langSwitcherHome: {
      position: 'absolute',
      top: 0,
      right: 0,
      display: 'flex',
      gap: '8px'
    },
    homeMainIcon: {
        fontSize: '48px',
        color: '#63b3ed',
        marginBottom: '16px'
    },
    homeTitle: {
        fontSize: '48px',
        fontWeight: 700,
        color: '#f7fafc',
        margin: '0 0 16px 0',
    },
    homeSubtitle: {
        fontSize: '20px',
        color: '#a0aec0',
        maxWidth: '600px',
        margin: '0 auto',
    },
    servicesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
    },
    serviceCard: {
        backgroundColor: '#2d3748',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid #4a5568',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
        textAlign: 'left',
    },
    serviceCardIconWrapper: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'rgba(99, 179, 237, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    serviceCardIcon: {
        fontSize: '24px',
        color: '#63b3ed',
    },
    serviceCardTitle: {
        fontSize: '20px',
        fontWeight: 600,
        color: '#f7fafc',
        margin: '0 0 8px 0',
    },
    serviceCardDescription: {
        fontSize: '15px',
        color: '#a0aec0',
        margin: 0,
        lineHeight: 1.5,
    },
    // --- END HOMEPAGE STYLES ---

    appContainer: { display: 'flex', height: '100vh', backgroundColor: '#1a202c' },
    sidebar: { width: '260px', backgroundColor: '#2d3748', padding: '24px', borderRight: '1px solid #4a5568', display: 'flex', flexDirection: 'column' },
    sidebarHeader: { display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #4a5568' },
    logo: { fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#f7fafc' },
    navList: { listStyle: 'none', padding: 0, margin: 0 },
    navItem: { display: 'flex', alignItems: 'center', padding: '12px 16px', marginBottom: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s, color 0.2s' },
    navItemSelected: { backgroundColor: '#2c5282', color: '#ffffff' },
    navIcon: { marginRight: '12px', width: '20px', textAlign: 'center' },
    mainContent: { flex: 1, display: 'flex', flexDirection: 'column', padding: '32px', overflow: 'hidden', position: 'relative' },
    mainHeader: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    mainTitle: { fontSize: '32px', margin: 0, color: '#f7fafc', fontWeight: 700 },
    mainDescription: { color: '#a0aec0', marginTop: '8px', fontSize: '16px' },
    backButton: {
      background: 'transparent',
      border: '1px solid #4a5568',
      color: '#a0aec0',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      transition: 'background-color 0.2s, color 0.2s',
    },
    langSwitcher: { display: 'flex', gap: '8px' },
    langButton: { padding: '8px 16px', border: '1px solid #4a5568', borderRadius: '6px', background: 'transparent', cursor: 'pointer', fontWeight: '600', color: '#a0aec0' },
    langButtonActive: { padding: '8px 16px', border: '1px solid #2c5282', borderRadius: '6px', background: '#2c5282', cursor: 'default', fontWeight: '600', color: 'white' },
    contentArea: { display: 'flex', flex: 1, gap: '24px', minHeight: 0 },
    inputPanel: { flex: '0 0 450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#2d3748', padding: '24px', borderRadius: '12px', border: '1px solid #4a5568' },
    inputGroup: { flex: 1, overflowY: 'auto', paddingRight: '10px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#a0aec0', fontSize: '14px' },
    optionsGroup: {
        borderTop: '1px solid #4a5568',
        marginTop: '20px',
        paddingTop: '20px',
    },
    groupLabel: {
        display: 'block',
        marginBottom: '16px',
        fontWeight: 'bold',
        color: '#cbd5e0',
        fontSize: '15px',
    },
    optionsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
    },
    textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4a5568', resize: 'vertical', boxSizing: 'border-box', fontSize: '16px', backgroundColor: '#1a202c', color: '#ffffff' },
    textInput: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4a5568', boxSizing: 'border-box', fontSize: '16px', backgroundColor: '#1a202c', color: '#ffffff' },
    select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4a5568', boxSizing: 'border-box', fontSize: '16px', appearance: 'none', background: '#1a202c url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a0aec0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 12px center', backgroundSize: '12px', color: '#ffffff' },
    fileInput: { display: 'none' },
    dropzone: {
      border: '2px dashed #4a5568',
      borderRadius: '12px',
      padding: '30px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.2s, border-color 0.2s',
      marginTop: '10px'
    },
    dropzoneActive: {
      borderColor: '#63b3ed',
      backgroundColor: 'rgba(99, 179, 237, 0.1)'
    },
    dropzoneIcon: {
      fontSize: '32px',
      color: '#63b3ed',
      marginBottom: '12px',
    },
    dropzoneText: {
      margin: '0 0 4px 0',
      color: '#a0aec0',
      fontWeight: 500
    },
    dropzoneBrowse: {
      color: '#63b3ed',
      fontWeight: 600,
      textDecoration: 'underline'
    },
    dropzoneHelperText: {
      margin: 0,
      fontSize: '12px',
      color: '#718096'
    },
    imagePreviewContainer: {
        position: 'relative',
        marginTop: '10px',
        width: '100%',
        height: '200px',
        backgroundColor: '#1a202c',
        borderRadius: '8px',
        border: '1px solid #4a5568',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    imagePreview: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' },
    clearButton: { position: 'absolute', top: '5px', right: '5px', background: 'rgba(0, 0, 0, 0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    generateButton: { width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#2c5282', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background-color 0.2s', marginTop: '16px' },
    generateButtonDisabled: { backgroundColor: '#4a5568', cursor: 'not-allowed' },
    errorText: { color: '#e53e3e', marginTop: '10px', textAlign: 'center' },
    outputPanel: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a202c', borderRadius: '12px', border: '2px dashed #4a5568', flexDirection: 'column', gap: '1rem', padding: '16px', overflow: 'auto' },
    loaderText: { color: '#a0aec0', fontSize: '1.1rem', fontWeight: '500' },
    generatedImageContainer: { position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    generatedImage: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' },
    imageActionsWrapper: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    downloadButton: {
        backgroundColor: 'rgba(26, 32, 44, 0.7)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        textDecoration: 'none',
        transition: 'background-color 0.2s',
    },
    editButton: {
        backgroundColor: 'rgba(26, 32, 44, 0.7)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        transition: 'background-color 0.2s',
    },
    placeholderText: { color: '#a0aec0', fontSize: '16px', textAlign: 'center' },
    historyPanel: { width: '320px', backgroundColor: '#2d3748', padding: '24px', borderLeft: '1px solid #4a5568', overflowY: 'auto' },
    historyTitle: { fontSize: '20px', margin: '0 0 20px 0', color: '#f7fafc', fontWeight: 600 },
    historyList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' },
    historyItem: {
        backgroundColor: '#1a202c',
        borderRadius: '12px',
        border: '1px solid #4a5568',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    historyItemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyImage: { width: '100%', borderRadius: '8px', border: '1px solid #4a5568' },
    historyItemTitle: { margin: '0', fontWeight: 600, color: '#e2e8f0', fontSize: '14px' },
    historyItemDetails: {},
    historyItemPrompt: { margin: '0', fontSize: '14px', color: '#a0aec0', maxHeight: '60px', overflow: 'hidden', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
    historyItemTimestamp: { color: '#718096', fontSize: '12px', flexShrink: 0, marginLeft: '8px' },
    historyItemActions: {
        borderTop: '1px solid #4a5568',
        paddingTop: '10px',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    rerunButton: {
        background: 'transparent',
        border: '1px solid #4a5568',
        color: '#a0aec0',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        transition: 'background-color 0.2s, color 0.2s',
    },
    textOutputContainer: { width: '100%', height: '100%', padding: '16px', boxSizing: 'border-box', textAlign: 'left', color: '#e2e8f0', overflowY: 'auto' },
    textOutputHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #4a5568', paddingBottom: '10px' },
    textOutputTitle: { marginTop: 0, color: '#63b3ed' },
    exportButton: {
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#2f855a',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        display: 'flex',
        alignItems: 'center',
    },
    summaryBox: { display: 'flex', justifyContent: 'space-around', background: '#1a202c', padding: '16px', borderRadius: '8px', margin: '16px 0', fontSize: '1.1em' },
    costTable: { width: '100%', borderCollapse: 'collapse', marginTop: '16px' },
    tableHeader: { borderBottom: '2px solid #63b3ed', padding: '12px', textAlign: 'left', color: '#e2e8f0' },
    tableCell: { borderBottom: '1px solid #4a5568', padding: '12px' },
    workerTypeTitle: { fontSize: '18px', color: '#e2e8f0', borderBottom: '1px solid #4a5568', paddingBottom: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    workerCountChip: { backgroundColor: '#4a5568', color: '#f7fafc', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '500' },
    dimensionInputsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#a0aec0',
    },
    dimensionInput: {
        flex: 1,
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #4a5568',
        boxSizing: 'border-box',
        fontSize: '16px',
        backgroundColor: '#1a202c',
        color: '#ffffff',
        textAlign: 'center'
    },
    footer: {
        textAlign: 'center',
        padding: '20px',
        fontSize: '14px',
        color: '#718096',
        flexShrink: 0,
    },
    suggestionsContainer: {
        marginTop: '12px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
    },
    suggestionButton: {
        padding: '6px 12px',
        borderRadius: '16px',
        border: '1px solid #4a5568',
        backgroundColor: '#1a202c',
        color: '#a0aec0',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'background-color 0.2s, color 0.2s',
    },
    suggestionsLoader: {
        fontSize: '13px',
        color: '#a0aec0',
        width: '100%',
    },
    // --- START EDIT MODAL STYLES ---
    editModalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    editModalContent: {
        backgroundColor: '#2d3748',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #4a5568',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
    },
    editModalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '16px',
        borderBottom: '1px solid #4a5568',
        marginBottom: '16px',
    },
    editModalTitle: {
        margin: 0,
        fontSize: '20px',
        fontWeight: 600,
        color: '#f7fafc',
    },
    editModalCloseButton: {
        background: 'transparent',
        border: 'none',
        color: '#a0aec0',
        fontSize: '24px',
        cursor: 'pointer',
    },
    editModalBody: {
        overflowY: 'auto',
        flex: 1,
    },
    editModalActions: {
        display: 'flex',
        gap: '12px',
        marginTop: '20px',
    },
    editModalLoader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
    },
    refinedImagePreview: {
        width: '100%',
        maxHeight: '400px',
        objectFit: 'contain',
        borderRadius: '8px',
        border: '1px solid #4a5568',
        backgroundColor: '#1a202c',
    },
    // --- END EDIT MODAL STYLES ---
};

export default App;