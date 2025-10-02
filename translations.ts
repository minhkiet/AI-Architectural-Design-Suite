import { FeatureKey } from "./types";

type Translations = {
  [key: string]: {
    logo: string;
    homeTitle: string;
    homeSubtitle: string;
    backToHome: string;
    features: {
      [key in FeatureKey]: {
        title: string;
        description: string;
        promptPlaceholder: string;
        imageUploadLabel: string;
      };
    };
    tooltips: {
      [key in FeatureKey | 'stylePreset' | 'negativePrompt' | 'aspectRatio' | 'detailLevel']: string;
    };
    promptLabel: string;
    mainImageLabel: string;
    decalImageLabel: string;
    startDateLabel: string;
    endDateLabel: string;
    workerCountLabel: string;
    dimensionsLabel: string;
    dimensionPlaceholders: {
      length: string;
      width: string;
      height: string;
    };
    negativePromptLabel: string;
    negativePromptPlaceholder: string;
    stylePresetLabel: string;
    stylePresets: {
      none: string;
      photorealistic: string;
      cartoon: string;
      impressionist: string;
      digital_art: string;
      cinematic: string;
    };
    aspectRatioLabel: string;
    aspectRatio: {
      square: string;
      widescreen: string;
      portrait: string;
      standard: string;
      tall: string;
    };
    detailLevelLabel: string;
    detailLevels: {
      low: string;
      medium: string;
      high: string;
    };
    dropzoneLabel: string;
    dropzoneBrowse: string;
    dropzoneHelper: string;
    generateButton: string;
    generatingButton: string;
    outputPlaceholder: string;
    loaderText: string;
    historyTitle: string;
    historyPlaceholder: string;
    costAnalysisTitle: string;
    taskAnalysisTitle: string;
    exportToExcel: string;
    totalArea: string;
    totalCost: string;
    costTableHeaders: {
      item: string;
      cost: string;
      details: string;
    };
    taskTableHeaders: {
      workerType: string;
      estimatedWorkers: string;
      task: string;
      priority: string;
      timeframe: string;
    };
    downloadImage: string;
    footerText: string;
    errors: {
      promptRequired: string;
      imageRequired: string;
      bothImagesRequired: string;
      general: (message: string) => string;
      noImageGenerated: string;
    };
  };
};

export const translations: Translations = {
  vi: {
    logo: "Arch-AI",
    homeTitle: "Bộ công cụ Thiết kế Kiến trúc AI",
    homeSubtitle: "Chọn một công cụ chuyên biệt để biến tầm nhìn của bạn thành hiện thực.",
    backToHome: "Quay lại Dịch vụ",
    features: {
      [FeatureKey.SURREAL_EXTERIOR]: {
        title: "Render Ngoại thất Siêu thực",
        description: "Tải lên ảnh ngoại thất hoặc bản vẽ để AI biến đổi, hoặc mô tả ý tưởng của bạn. AI sẽ tập trung vào chi tiết ánh sáng, vật liệu và môi trường.",
        promptPlaceholder: "ví dụ: biệt thự gỗ tối màu, phong cách tối giản, bên bờ hồ vào buổi hoàng hôn",
        imageUploadLabel: "Tải lên Ảnh Ngoại thất hoặc Bản vẽ (tùy chọn)",
      },
      [FeatureKey.INSTANT_INTERIOR]: {
        title: "Thiết kế Nội thất Tức thì",
        description: "AI sẽ thay đổi phong cách và nội thất của ảnh đầu vào theo prompt.",
        promptPlaceholder: "ví dụ: Phòng khách scandinavian, tông trắng kem, vật liệu da và gỗ sồi",
        imageUploadLabel: "Tải lên Ảnh Nội thất hiện có",
      },
      [FeatureKey.MASTER_PLAN]: {
        title: "Quy hoạch Dự án Tổng thể",
        description: "AI sẽ tạo ra bản đồ quy hoạch tổng thể, thể hiện mối quan hệ giữa các khối kiến trúc và không gian xanh.",
        promptPlaceholder: "ví dụ: Khu phức hợp căn hộ nghỉ dưỡng ven biển, 5 tòa tháp, hồ bơi vô cực",
        imageUploadLabel: "Tải lên bản đồ hiện trạng hoặc ảnh vệ tinh",
      },
      [FeatureKey.SMART_EDIT]: {
        title: "Chỉnh sửa Thông minh / Thêm chi tiết",
        description: "Chỉnh sửa ảnh bằng ngôn ngữ tự nhiên hoặc thêm chi tiết/decal từ một ảnh khác.",
        promptPlaceholder: "ví dụ: Thêm hoa văn này vào cửa sổ chính, hoặc thay đổi vật liệu tường thành gạch",
        imageUploadLabel: "", // Not used, replaced by specific labels
      },
      [FeatureKey.SKETCHUP_FINALIZE]: {
        title: "Hoàn thiện Nét vẽ SketchUp",
        description: "AI sẽ biến bản phác thảo thô thành render chất lượng cao.",
        promptPlaceholder: "ví dụ: Render thành kết cấu bê tông trần, kính cường lực, có người đi bộ",
        imageUploadLabel: "Tải lên Ảnh Sketchup hoặc bản vẽ đường nét",
      },
      [FeatureKey.PLAN_TO_3D]: {
        title: "Chuyển Mặt bằng 2D sang 3D",
        description: "AI sẽ tạo ra mô hình 3D khối (block-out) dựa trên mặt bằng 2D.",
        promptPlaceholder: "ví dụ: Mô hình 3D khối trắng, ánh sáng ban ngày, không có nội thất",
        imageUploadLabel: "Tải lên Ảnh Mặt bằng 2D",
      },
      [FeatureKey.COST_CALCULATION]: {
        title: "Tính toán Kích thước & Chi phí",
        description: "AI sẽ ước tính sơ bộ diện tích và chi phí xây dựng/hoàn thiện dựa trên thông tin đầu vào.",
        promptPlaceholder: "ví dụ: biệt thự 200m2, 3 tầng, vật liệu chính là bê tông và kính",
        imageUploadLabel: "Tải lên Mặt bằng hoặc Mô hình 3D (tùy chọn)",
      },
      [FeatureKey.TASK_GENERATOR]: {
        title: "Tạo Danh sách Công việc",
        description: "AI sẽ tạo ra một danh sách công việc chi tiết, phân bổ theo từng loại thợ dựa trên mô tả, bản vẽ, kích thước, khung thời gian và số lượng nhân công bạn cung cấp.",
        promptPlaceholder: "ví dụ: Lập kế hoạch thiết kế và thi công hoàn thiện nội thất căn hộ 2 phòng ngủ",
        imageUploadLabel: "Tải lên Bản vẽ Kỹ thuật (tùy chọn)",
      },
    },
    tooltips: {
      [FeatureKey.SURREAL_EXTERIOR]: "Tạo ra các phối cảnh ngoại thất độc đáo, không giới hạn bởi thực tế.",
      [FeatureKey.INSTANT_INTERIOR]: "Sử dụng ảnh nội thất hiện có và biến đổi nó theo phong cách bạn muốn.",
      [FeatureKey.MASTER_PLAN]: "Phát triển các phương án quy hoạch tổng thể cho các dự án lớn từ ý tưởng ban đầu.",
      [FeatureKey.SMART_EDIT]: "Chỉnh sửa hình ảnh render của bạn bằng cách mô tả các thay đổi hoặc cung cấp một hình ảnh chi tiết.",
      [FeatureKey.SKETCHUP_FINALIZE]: "Nâng cấp các mô hình SketchUp hoặc bản vẽ nét của bạn thành hình ảnh render chân thực.",
      [FeatureKey.PLAN_TO_3D]: "Tự động tạo mô hình 3D từ các bản vẽ mặt bằng 2D để hình dung không gian.",
      [FeatureKey.COST_CALCULATION]: "Nhận ước tính chi phí và diện tích xây dựng nhanh chóng dựa trên mô tả hoặc bản vẽ.",
      [FeatureKey.TASK_GENERATOR]: "Tự động tạo danh sách công việc, phân bổ theo loại thợ và các mốc thời gian cho dự án của bạn.",
      stylePreset: "Chọn một phong cách nghệ thuật để áp dụng cho hình ảnh được tạo ra.",
      negativePrompt: "Mô tả những yếu tố bạn muốn loại trừ khỏi hình ảnh cuối cùng.",
      aspectRatio: "Xác định tỷ lệ chiều rộng và chiều cao của hình ảnh cuối cùng.",
      detailLevel: "Kiểm soát mức độ chi tiết và phức tạp trong kết quả render.",
    },
    promptLabel: "Yêu cầu",
    mainImageLabel: "Ảnh chính cần chỉnh sửa",
    decalImageLabel: "Ảnh Chi tiết (Decal)",
    startDateLabel: "Ngày Bắt đầu",
    endDateLabel: "Ngày Kết thúc",
    workerCountLabel: "Số lượng Nhân công",
    dimensionsLabel: "Kích thước thực tế (mét)",
    dimensionPlaceholders: {
      length: "Dài",
      width: "Rộng",
      height: "Cao",
    },
    negativePromptLabel: "Yêu cầu Phủ định",
    negativePromptPlaceholder: "Những thứ cần tránh trong ảnh, ví dụ: văn bản, màu đỏ, xấu xí",
    stylePresetLabel: "Phong cách",
    stylePresets: {
      none: "Mặc định",
      photorealistic: "Chân thực",
      cartoon: "Hoạt hình",
      impressionist: "Trường phái Ấn tượng",
      digital_art: "Nghệ thuật số",
      cinematic: "Điện ảnh",
    },
    aspectRatioLabel: "Tỷ lệ Khung hình",
    aspectRatio: {
      square: "1:1 (Vuông)",
      widescreen: "16:9 (Màn ảnh rộng)",
      portrait: "9:16 (Dọc)",
      standard: "4:3 (Tiêu chuẩn)",
      tall: "3:4 (Cao)",
    },
    detailLevelLabel: "Mức độ Chi tiết",
    detailLevels: {
      low: "Thấp",
      medium: "Trung bình",
      high: "Cao",
    },
    dropzoneLabel: "Kéo và thả ảnh vào đây hoặc ",
    dropzoneBrowse: "chọn tệp",
    dropzoneHelper: "Hỗ trợ: JPG, PNG, WEBP",
    generateButton: "Tạo",
    generatingButton: "Đang tạo...",
    outputPlaceholder: "Kết quả của bạn sẽ xuất hiện ở đây.",
    loaderText: "Kiến tạo tầm nhìn của bạn...",
    historyTitle: "Lịch sử Kết xuất",
    historyPlaceholder: "Chưa có bản kết xuất nào.",
    costAnalysisTitle: "Phân tích Chi phí Sơ bộ",
    taskAnalysisTitle: "Danh sách Công việc Dự án",
    exportToExcel: "Xuất ra file Excel",
    totalArea: "Tổng diện tích",
    totalCost: "Tổng chi phí",
    costTableHeaders: {
      item: "Hạng mục",
      cost: "Chi phí",
      details: "Chi tiết",
    },
    taskTableHeaders: {
      workerType: "Loại thợ",
      estimatedWorkers: "Số lượng (ước tính)",
      task: "Công việc",
      priority: "Độ ưu tiên",
      timeframe: "Thời gian / Hạn chót",
    },
    downloadImage: "Tải xuống Ảnh",
    footerText: "Bản quyền thuộc về nơi không biên giới",
    errors: {
      promptRequired: "Vui lòng nhập yêu cầu.",
      imageRequired: "Vui lòng tải lên một hình ảnh cho tính năng này.",
      bothImagesRequired: "Vui lòng tải lên cả ảnh chính và ảnh chi tiết cho tính năng này.",
      general: (message: string) => `Đã xảy ra lỗi: ${message}`,
      noImageGenerated: "Không có hình ảnh nào được tạo. Mô hình có thể đã từ chối yêu cầu.",
    },
  },
  en: {
    logo: "Arch-AI",
    homeTitle: "AI Architectural Design Suite",
    homeSubtitle: "Select a specialized tool to bring your vision to life.",
    backToHome: "Back to Services",
    features: {
      [FeatureKey.SURREAL_EXTERIOR]: {
        title: "Surreal Exterior Render",
        description: "Upload a real photo or drawing for AI transformation, or describe your vision to generate from scratch. Focus on lighting, materials, and environment.",
        promptPlaceholder: "e.g., dark wood villa, minimalist style, by a lake at sunset",
        imageUploadLabel: "Upload Exterior Photo or Drawing (optional)",
      },
      [FeatureKey.INSTANT_INTERIOR]: {
        title: "Instant Interior Design",
        description: "The AI will change the style and furnishings of the input photo according to the prompt.",
        promptPlaceholder: "e.g., Scandinavian living room, cream-white tones, leather and oak materials",
        imageUploadLabel: "Upload an existing interior photo",
      },
      [FeatureKey.MASTER_PLAN]: {
        title: "Master Plan Project",
        description: "The AI will create a master plan map, showing relationships between architectural blocks and green spaces.",
        promptPlaceholder: "e.g., Seaside resort apartment complex, 5 towers, infinity pool",
        imageUploadLabel: "Upload existing site plan or satellite image",
      },
      [FeatureKey.SMART_EDIT]: {
        title: "Smart Edit / Add Detail",
        description: "Edit images with natural language, or add details/decals from another image.",
        promptPlaceholder: "e.g., Add this pattern to the main window, or change the wall material to brick",
        imageUploadLabel: "", // Not used, replaced by specific labels
      },
      [FeatureKey.SKETCHUP_FINALIZE]: {
        title: "Finalize SketchUp Drawing",
        description: "The AI will transform the rough sketch into a high-quality render.",
        promptPlaceholder: "e.g., Render with a raw concrete texture, tempered glass, with pedestrians",
        imageUploadLabel: "Upload a Sketchup image or line drawing",
      },
      [FeatureKey.PLAN_TO_3D]: {
        title: "Convert 2D Plan to 3D",
        description: "The AI will create a 3D block-out model based on the 2D floor plan.",
        promptPlaceholder: "e.g., White block 3D model, daylight, no furniture",
        imageUploadLabel: "Upload a 2D floor plan image",
      },
      [FeatureKey.COST_CALCULATION]: {
        title: "Cost & Size Calculation",
        description: "The AI provides a preliminary estimate of the area and construction/finishing costs based on the input.",
        promptPlaceholder: "e.g., 200sqm villa, 3 floors, main materials are concrete and glass",
        imageUploadLabel: "Upload Floor Plan or 3D Model (optional)",
      },
      [FeatureKey.TASK_GENERATOR]: {
        title: "Task List Generator",
        description: "The AI will generate a detailed task list, categorized by worker type, based on your description, drawing, dimensions, timeframe, and provided number of workers.",
        promptPlaceholder: "e.g., Plan the design and finishing work for a two-bedroom apartment interior",
        imageUploadLabel: "Upload Technical Drawing (optional)",
      },
    },
    tooltips: {
      [FeatureKey.SURREAL_EXTERIOR]: "Generate unique exterior scenes, not bound by reality.",
      [FeatureKey.INSTANT_INTERIOR]: "Use an existing interior photo and transform it into your desired style.",
      [FeatureKey.MASTER_PLAN]: "Develop master planning options for large projects from initial concepts.",
      [FeatureKey.SMART_EDIT]: "Modify your rendered images by describing changes or providing a detail image.",
      [FeatureKey.SKETCHUP_FINALIZE]: "Upgrade your SketchUp models or line drawings into photorealistic renders.",
      [FeatureKey.PLAN_TO_3D]: "Automatically generate a 3D model from 2D floor plans for spatial visualization.",
      [FeatureKey.COST_CALCULATION]: "Get a quick estimate of construction costs and area based on a description or drawing.",
      [FeatureKey.TASK_GENERATOR]: "Automatically generate to-do lists, categorized by worker type, with timelines for your project.",
      stylePreset: "Choose an artistic style to apply to the generated image.",
      negativePrompt: "Describe elements you want to exclude from the final image.",
      aspectRatio: "Define the width-to-height ratio of the final image.",
      detailLevel: "Control the amount of detail and complexity in the rendered output.",
    },
    promptLabel: "Prompt",
    mainImageLabel: "Main Image to Edit",
    decalImageLabel: "Detail Image (Decal)",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    workerCountLabel: "Number of Workers",
    dimensionsLabel: "Actual Dimensions (meters)",
    dimensionPlaceholders: {
      length: "Length",
      width: "Width",
      height: "Height",
    },
    negativePromptLabel: "Negative Prompt",
    negativePromptPlaceholder: "Things to avoid in the image, e.g., text, red color, ugly",
    stylePresetLabel: "Style Preset",
    stylePresets: {
      none: "Default",
      photorealistic: "Photorealistic",
      cartoon: "Cartoon",
      impressionist: "Impressionist",
      digital_art: "Digital Art",
      cinematic: "Cinematic",
    },
    aspectRatioLabel: "Aspect Ratio",
    aspectRatio: {
      square: "1:1 (Square)",
      widescreen: "16:9 (Widescreen)",
      portrait: "9:16 (Portrait)",
      standard: "4:3 (Standard)",
      tall: "3:4 (Tall)",
    },
    detailLevelLabel: "Detail Level",
    detailLevels: {
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    dropzoneLabel: "Drag & drop your image here, or ",
    dropzoneBrowse: "browse files",
    dropzoneHelper: "Supports: JPG, PNG, WEBP",
    generateButton: "Generate",
    generatingButton: "Generating...",
    outputPlaceholder: "Your result will appear here.",
    loaderText: "Architecting your vision...",
    historyTitle: "Render History",
    historyPlaceholder: "No renders yet.",
    costAnalysisTitle: "Preliminary Cost Analysis",
    taskAnalysisTitle: "Project Task List",
    exportToExcel: "Export to Excel",
    totalArea: "Total Area",
    totalCost: "Total Cost",
    costTableHeaders: {
      item: "Item",
      cost: "Cost",
      details: "Details",
    },
    taskTableHeaders: {
      workerType: "Worker Type",
      estimatedWorkers: "Est. Workers",
      task: "Task",
      priority: "Priority",
      timeframe: "Timeline / Duration",
    },
    downloadImage: "Download Image",
    footerText: "Copyright © No Border Place",
    errors: {
      promptRequired: "Please enter a prompt.",
      imageRequired: "Please upload an image for this feature.",
      bothImagesRequired: "Please upload both the main image and the detail image for this feature.",
      general: (message: string) => `An error occurred: ${message}`,
      noImageGenerated: "No image was generated. The model may have refused the prompt.",
    },
  },
};