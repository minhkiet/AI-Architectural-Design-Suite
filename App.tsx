import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { Feature, FeatureKey, RenderHistoryItem } from './types';
import { translations } from './translations';

const features: Feature[] = [
  { key: FeatureKey.SURREAL_EXTERIOR, icon: 'fa-solid fa-tree-city', imageUpload: 'optional', outputType: 'image' },
  { key: FeatureKey.INSTANT_INTERIOR, icon: 'fa-solid fa-couch', imageUpload: 'required', outputType: 'image' },
  { key: FeatureKey.MASTER_PLAN, icon: 'fa-solid fa-map', imageUpload: 'required', outputType: 'image' },
  { key: FeatureKey.SMART_EDIT, icon: 'fa-solid fa-wand-magic-sparkles', imageUpload: 'required', outputType: 'image' },
  { key: FeatureKey.SKETCHUP_FINALIZE, icon: 'fa-solid fa-cube', imageUpload: 'required', outputType: 'image' },
  { key: FeatureKey.PLAN_TO_3D, icon: 'fa-solid fa-drafting-compass', imageUpload: 'required', outputType: 'image' },
  { key: FeatureKey.COST_CALCULATION, icon: 'fa-solid fa-calculator', imageUpload: 'optional', outputType: 'text' },
  { key: FeatureKey.TASK_GENERATOR, icon: 'fa-solid fa-list-check', imageUpload: 'none', outputType: 'text' },
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
            onFileSelect(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileSelect(e.target.files?.[0] ?? null);
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={styles.label}>{label}</label>
            <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} style={styles.fileInput} />
            
            {imageUrl ? (
                <div style={{ marginTop: '10px', position: 'relative' }}>
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
  
  const T = useMemo(() => translations[language], [language]);
  
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.REACT_APP_API_KEY! || process.env.API_KEY! }), []);
  const selectedFeature = features.find(f => f.key === selectedFeatureKey)!;
  const selectedFeatureText = T.features[selectedFeature.key];
  
  useEffect(() => {
    return () => {
      if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
      if (decalImageUrl) URL.revokeObjectURL(decalImageUrl);
    };
  }, [uploadedImageUrl, decalImageUrl]);

  const processMainFile = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
       if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
      setUploadedImage(file);
      setUploadedImageUrl(URL.createObjectURL(file));
      setGeneratedImageUrl(null);
      setGeneratedTextOutput(null);
      setError(null);
    }
  };

  const processDecalFile = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
        if (decalImageUrl) URL.revokeObjectURL(decalImageUrl);
        setDecalImage(file);
        setDecalImageUrl(URL.createObjectURL(file));
    }
  };

  const clearMainImage = () => {
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    setUploadedImage(null);
    setUploadedImageUrl(null);
  };
  
  const clearDecalImage = () => {
    if (decalImageUrl) URL.revokeObjectURL(decalImageUrl);
    setDecalImage(null);
    setDecalImageUrl(null);
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
                    projectName: { type: Type.STRING, description: 'The name of the project the tasks are for.' },
                    tasks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                taskName: { type: Type.STRING, description: 'The name or description of the task.' },
                                priority: { type: Type.STRING, description: 'Priority level (e.g., High, Medium, Low).' },
                                dueDate: { type: Type.STRING, description: 'Suggested due date or timeframe (e.g., "End of Week 1", "2024-12-25").' }
                            },
                            required: ['taskName', 'priority', 'dueDate']
                        }
                    }
                },
                required: ['projectName', 'tasks']
            };
            systemInstruction = `You are an expert project manager for architectural projects. Analyze the user's prompt to generate a structured list of tasks. Respond in the user's language (${language}).`;
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
          const { data, mimeType } = await fileToBase64(uploadedImage);
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [{ inlineData: { data, mimeType } }, { text: prompt }] },
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
      const newHistoryItem: RenderHistoryItem = {
        id: new Date().toISOString(),
        featureKey: selectedFeature.key,
        featureTitle: T.features[selectedFeature.key].title,
        prompt: prompt,
        imageUrl: resultImageUrl,
        timestamp: new Date().toLocaleString(language),
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (e) {
      console.error(e);
      setError(T.errors.general(e instanceof Error ? e.message : String(e)));
    } finally {
      setIsLoading(false);
    }
  }, [prompt, uploadedImage, decalImage, selectedFeature, ai, aspectRatio, T, language, negativePrompt, stylePreset, detailLevel]);

  const renderTextOutput = (data: any) => (
    <div style={styles.textOutputContainer} className="animate-fade-in">
        <h3 style={styles.textOutputTitle}>{T.costAnalysisTitle}</h3>
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
        <h3 style={styles.textOutputTitle}>{T.taskAnalysisTitle}: {data.projectName}</h3>
        {data.tasks && (
            <table style={styles.costTable}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>{T.taskTableHeaders.task}</th>
                        <th style={styles.tableHeader}>{T.taskTableHeaders.priority}</th>
                        <th style={styles.tableHeader}>{T.taskTableHeaders.dueDate}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.tasks.map((task: any, index: number) => (
                        <tr key={index}>
                            <td style={styles.tableCell}>{task.taskName}</td>
                            <td style={styles.tableCell}>{task.priority}</td>
                            <td style={styles.tableCell}>{task.dueDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
  );
  
  if (!isStudioVisible) {
    return (
        <div style={styles.homePageContainer}>
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
    );
  }

  return (
    <div style={styles.appContainer}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
            <i className="fa-solid fa-drafting-compass" style={{ fontSize: '24px', color: '#2c5282' }}></i>
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
                    <i className={feature.icon} style={{...styles.navIcon, color: isSelected ? '#fff' : '#4a5568' }}></i>
                    <span style={{color: isSelected ? '#fff' : '#1a202c' }}>{featureText.title}</span>
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
      </main>

      <aside style={styles.historyPanel}>
        <h3 style={styles.historyTitle}>{T.historyTitle}</h3>
        {history.length === 0 ? (
          <p style={styles.placeholderText}>{T.historyPlaceholder}</p>
        ) : (
          <ul style={styles.historyList}>
            {history.map(item => (
              <li key={item.id} style={styles.historyItem}>
                <img src={item.imageUrl} alt="History item" style={styles.historyImage}/>
                <h4 style={styles.historyItemTitle}>{item.featureTitle}</h4>
                <p style={styles.historyItemPrompt}>{item.prompt}</p>
                <small style={styles.historyItemTimestamp}>{item.timestamp}</small>
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
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '40px',
        boxSizing: 'border-box'
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
        color: '#2c5282',
        marginBottom: '16px'
    },
    homeTitle: {
        fontSize: '48px',
        fontWeight: 700,
        color: '#1a202c',
        margin: '0 0 16px 0',
    },
    homeSubtitle: {
        fontSize: '20px',
        color: '#4a5568',
        maxWidth: '600px',
        margin: '0 auto',
    },
    servicesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
    },
    serviceCard: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        textAlign: 'left',
    },
    // Hover effect for serviceCard would be managed by a CSS class or inline style state change. Let's add it directly:
    // ... onMouseEnter/Leave or a CSS :hover class would be better, but for this structure:
    // The user should add a :hover in the main style tag for this to work best. We'll simulate with inline styles for now.
    serviceCardIconWrapper: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'rgba(44, 82, 130, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    serviceCardIcon: {
        fontSize: '24px',
        color: '#2c5282',
    },
    serviceCardTitle: {
        fontSize: '20px',
        fontWeight: 600,
        color: '#1a202c',
        margin: '0 0 8px 0',
    },
    serviceCardDescription: {
        fontSize: '15px',
        color: '#4a5568',
        margin: 0,
        lineHeight: 1.5,
    },
    // --- END HOMEPAGE STYLES ---

    appContainer: { display: 'flex', height: '100vh', backgroundColor: '#f8f9fa' },
    sidebar: { width: '260px', backgroundColor: '#ffffff', padding: '24px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' },
    sidebarHeader: { display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0' },
    logo: { fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1a202c' },
    navList: { listStyle: 'none', padding: 0, margin: 0 },
    navItem: { display: 'flex', alignItems: 'center', padding: '12px 16px', marginBottom: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s, color 0.2s' },
    navItemSelected: { backgroundColor: '#2c5282', color: '#ffffff' },
    navIcon: { marginRight: '12px', width: '20px', textAlign: 'center' },
    mainContent: { flex: 1, display: 'flex', flexDirection: 'column', padding: '32px', overflow: 'hidden' },
    mainHeader: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    mainTitle: { fontSize: '32px', margin: 0, color: '#1a202c', fontWeight: 700 },
    mainDescription: { color: '#4a5568', marginTop: '8px', fontSize: '16px' },
    backButton: {
      background: 'transparent',
      border: '1px solid #e2e8f0',
      color: '#4a5568',
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
    langButton: { padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#4a5568' },
    langButtonActive: { padding: '8px 16px', border: '1px solid #2c5282', borderRadius: '6px', background: '#2c5282', cursor: 'default', fontWeight: '600', color: 'white' },
    contentArea: { display: 'flex', flex: 1, gap: '24px', minHeight: 0 },
    inputPanel: { flex: '0 0 450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    inputGroup: { flex: 1, overflowY: 'auto', paddingRight: '10px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748', fontSize: '14px' },
    textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4a5568', resize: 'vertical', boxSizing: 'border-box', fontSize: '16px', backgroundColor: '#2d3748', color: '#ffffff' },
    select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4a5568', boxSizing: 'border-box', fontSize: '16px', appearance: 'none', background: '#2d3748 url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a0aec0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 12px center', backgroundSize: '12px', color: '#ffffff' },
    fileInput: { display: 'none' },
    dropzone: {
      border: '2px dashed #d2d6dc',
      borderRadius: '12px',
      padding: '30px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.2s, border-color 0.2s',
      marginTop: '10px'
    },
    dropzoneActive: {
      borderColor: '#2c5282',
      backgroundColor: 'rgba(44, 82, 130, 0.05)'
    },
    dropzoneIcon: {
      fontSize: '32px',
      color: '#2c5282',
      marginBottom: '12px',
    },
    dropzoneText: {
      margin: '0 0 4px 0',
      color: '#4a5568',
      fontWeight: 500
    },
    dropzoneBrowse: {
      color: '#2c5282',
      fontWeight: 600,
      textDecoration: 'underline'
    },
    dropzoneHelperText: {
      margin: 0,
      fontSize: '12px',
      color: '#a0aec0'
    },
    imagePreview: { maxWidth: '100%', maxHeight: '150px', marginTop: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', objectFit: 'cover', width: '100%' },
    clearButton: { position: 'absolute', top: '5px', right: '5px', background: 'rgba(0, 0, 0, 0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    generateButton: { width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#2c5282', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background-color 0.2s', marginTop: '16px' },
    generateButtonDisabled: { backgroundColor: '#a0aec0', cursor: 'not-allowed' },
    errorText: { color: '#dc3545', marginTop: '10px', textAlign: 'center' },
    outputPanel: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: '12px', border: '2px dashed #e2e8f0', flexDirection: 'column', gap: '1rem', padding: '16px', overflow: 'auto' },
    loaderText: { color: '#4a5568', fontSize: '1.1rem', fontWeight: '500' },
    generatedImageContainer: { position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    generatedImage: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' },
    downloadButton: {
        position: 'absolute',
        top: '16px',
        right: '16px',
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
    placeholderText: { color: '#4a5568', fontSize: '16px', textAlign: 'center' },
    historyPanel: { width: '320px', backgroundColor: '#ffffff', padding: '24px', borderLeft: '1px solid #e2e8f0', overflowY: 'auto' },
    historyTitle: { fontSize: '20px', margin: '0 0 20px 0', color: '#1a202c', fontWeight: 600 },
    historyList: { listStyle: 'none', padding: 0, margin: 0 },
    historyItem: { marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' },
    historyImage: { width: '100%', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e2e8f0' },
    historyItemTitle: { margin: '0 0 5px 0', fontWeight: 600, color: '#1a202c' },
    historyItemPrompt: { margin: '0 0 8px 0', fontSize: '14px', color: '#4a5568', maxHeight: '60px', overflow: 'hidden' },
    historyItemTimestamp: { color: '#a0aec0', fontSize: '12px' },
    textOutputContainer: { width: '100%', height: '100%', padding: '16px', boxSizing: 'border-box', textAlign: 'left', color: '#1a202c', overflowY: 'auto' },
    textOutputTitle: { marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' },
    summaryBox: { display: 'flex', justifyContent: 'space-around', background: '#f7fafc', padding: '16px', borderRadius: '8px', margin: '16px 0', fontSize: '1.1em' },
    costTable: { width: '100%', borderCollapse: 'collapse', marginTop: '16px' },
    tableHeader: { borderBottom: '2px solid #2c5282', padding: '12px', textAlign: 'left', color: '#2d3748' },
    tableCell: { borderBottom: '1px solid #e2e8f0', padding: '12px' },
};

export default App;