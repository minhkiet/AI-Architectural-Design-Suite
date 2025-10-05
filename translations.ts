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
      [key in FeatureKey | 'stylePreset' | 'negativePrompt' | 'aspectRatio' | 'detailLevel' | 'rerunPrompt' | 'tooltipCameraAngle' | 'tooltipSetting' | 'detailedPromptTooltip']: string;
    };
    promptLabel: string;
    analyzingForSuggestions: string;
    generateDetailedPrompt: string;
    generatingDetailedPrompt: string;
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
    cameraAngleLabel: string;
    cameraAngles: {
      none: string;
      eye_level: string;
      low_angle: string;
      high_angle: string;
      aerial: string;
      close_up: string;
      dutch_angle: string;
      wide_angle: string;
    };
    settingLabel: string;
    settingPlaceholder: string;
    negativePromptLabel: string;
    negativePromptPlaceholder: string;
    stylePresetLabel: string;
    stylePresets: {
      none: string;
      photorealistic: string;
      minimalist: string;
      modern: string;
      brutalist: string;
      art_deco: string;
      gothic: string;
      neoclassical: string;
      deconstructivist: string;
      biophilic: string;
    };
    stylePresetDescriptions?: {
       [key: string]: string;
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
    promptPrefixes: {
      image_to_image: {
        [key in FeatureKey | 'INSTANT_INTERIOR_PREFIX_CHECK']?: string;
      };
    };
    suggestionPrompts: {
      [key in FeatureKey | 'default' | 'detailedStructurePrompt']?: string;
    };
    techDrawingOptions: {
      groupLabel: string;
      drawingScale: { label: string; placeholder: string; };
      lineThickness: { label: string; options: { thin: string; medium: string; thick: string; }; };
      lineStyle: { label: string; options: { solid: string; dashed: string; dotted: string; }; };
      symbolLibrary: { label: string; options: { generic: string; ansi: string; iso: string; }; };
    };
    techDrawingSpecifications: (specs: { scale: string; thickness: string; style: string; library: string; }) => string;
    downloadImage: string;
    editImage: string;
    refineImageTitle: string;
    refinePromptLabel: string;
    refinePromptPlaceholder: string;
    refineDecalLabel: string;
    refineButton: string;
    refiningButton: string;
    refinedImageAlt: string;
    saveAndReplace: string;
    makeAnotherChange: string;
    undoButton: string;
    redoButton: string;
    closeButton: string;
    refinedLabel: string;
    footerText: string;
    errors: {
      promptRequired: string;
      promptOrStyleRequired: string;
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
        description: "AI sẽ thay đổi phong cách và nội thất của ảnh đầu vào theo prompt hoặc phong cách bạn chọn, trong khi vẫn giữ lại cấu trúc chính của không gian.",
        promptPlaceholder: "ví dụ: Thêm một chiếc ghế sofa màu be, hoặc để trống và chỉ chọn một phong cách",
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
       [FeatureKey.REAL_TO_TECH_DRAWING]: {
        title: "Chuyển Ảnh Thực thành Bản vẽ Kỹ thuật 2D",
        description: "Tải lên ảnh chụp công trình thực tế. AI sẽ chuyển đổi nó thành một bản vẽ kỹ thuật với các đường nét, chi tiết và ký hiệu chuyên nghiệp.",
        promptPlaceholder: "ví dụ: Bản vẽ mặt cắt ngang, chi tiết cửa sổ nhôm kính",
        imageUploadLabel: "Tải lên Ảnh chụp công trình thực tế",
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
      [FeatureKey.REAL_TO_TECH_DRAWING]: "Chuyển đổi ảnh chụp một công trình thành một bản vẽ kỹ thuật 2D chi tiết.",
      [FeatureKey.COST_CALCULATION]: "Nhận ước tính chi phí và diện tích xây dựng nhanh chóng dựa trên mô tả hoặc bản vẽ.",
      [FeatureKey.TASK_GENERATOR]: "Tự động tạo danh sách công việc, phân bổ theo loại thợ và các mốc thời gian cho dự án của bạn.",
      stylePreset: "Chọn một phong cách kiến trúc để áp dụng cho hình ảnh được tạo ra.",
      negativePrompt: "Mô tả những yếu tố bạn muốn loại trừ khỏi hình ảnh cuối cùng.",
      aspectRatio: "Xác định tỷ lệ chiều rộng và chiều cao của hình ảnh cuối cùng.",
      detailLevel: "Kiểm soát mức độ chi tiết và phức tạp trong kết quả render.",
      rerunPrompt: "Chạy lại với cùng prompt và cài đặt",
      tooltipCameraAngle: "Chọn góc nhìn của camera ảo cho khung cảnh.",
      tooltipSetting: "Mô tả môi trường, thời gian trong ngày, hoặc không khí xung quanh chủ thể.",
      detailedPromptTooltip: "Tự động tạo một prompt mô tả chi tiết cấu trúc của ảnh (cửa, cửa sổ, v.v.) để đảm bảo AI giữ lại các yếu tố này khi thiết kế lại.",
    },
    promptLabel: "Yêu cầu",
    analyzingForSuggestions: "Đang phân tích ảnh để đưa ra gợi ý...",
    generateDetailedPrompt: "Đề xuất Prompt Chi tiết từ Ảnh",
    generatingDetailedPrompt: "Đang phân tích cấu trúc...",
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
    cameraAngleLabel: "Góc quay Camera",
    cameraAngles: {
      none: "Mặc định",
      eye_level: "Ngang tầm mắt",
      low_angle: "Góc thấp",
      high_angle: "Góc cao",
      aerial: "Nhìn từ trên / Drone",
      close_up: "Cận cảnh chi tiết",
      dutch_angle: "Góc nghiêng",
      wide_angle: "Góc rộng",
    },
    settingLabel: "Bối cảnh / Môi trường",
    settingPlaceholder: "ví dụ: trong một thành phố tương lai, buổi sáng sương mù, bao quanh bởi rừng rậm",
    negativePromptLabel: "Yêu cầu Phủ định",
    negativePromptPlaceholder: "Những thứ cần tránh trong ảnh, ví dụ: văn bản, màu đỏ, xấu xí",
    stylePresetLabel: "Phong cách Kiến trúc",
    stylePresets: {
      none: "Mặc định",
      photorealistic: "Chân thực",
      minimalist: "Tối giản",
      modern: "Hiện đại",
      brutalist: "Thô mộc (Brutalist)",
      art_deco: "Art Deco",
      gothic: "Gothic",
      neoclassical: "Tân cổ điển",
      deconstructivist: "Giải tỏa kết cấu",
      biophilic: "Biophilic / Hữu cơ",
    },
    stylePresetDescriptions: {
      photorealistic: "Biến đổi không gian với ánh sáng, kết cấu và vật liệu siêu thực. Mục tiêu là một hình ảnh chân thực, sống động như thật, tôn trọng bố cục và các đặc điểm kiến trúc ban đầu của căn phòng.",
      minimalist: "Thiết kế lại nội thất theo thẩm mỹ tối giản. Tập trung vào các đường nét gọn gàng, hình khối hình học đơn giản, và một không gian ngăn nắp, thanh bình. Sử dụng bảng màu trung tính hoặc đơn sắc. Điều quan trọng là phải duy trì bố cục phòng ban đầu, bao gồm cả cửa sổ và cửa ra vào.",
      modern: "Giới thiệu phong cách thiết kế hiện đại bằng cách sử dụng các vật liệu như kính, thép, và bê tông bóng. Nhấn mạnh không gian mở trong bố cục hiện có, bảng màu đơn giản, và đồ nội thất gọn gàng, hình học. Không thay đổi cấu trúc cốt lõi của căn phòng.",
      brutalist: "Tái hiện nội thất theo phong cách Thô mộc (Brutalist). Nổi bật với bê tông trần, các hình khối lớn, và cảm giác nguyên khối, bề thế. Thiết kế phải thể hiện sự trung thực về vật liệu trong khi vẫn bảo tồn lớp vỏ kiến trúc hiện có của căn phòng.",
      art_deco: "Truyền vào không gian sự quyến rũ của Art Deco. Giới thiệu các họa tiết hình học táo bạo, thiết kế đối xứng, vật liệu phong phú như kim loại đánh bóng và gỗ quý, cùng các chi tiết trang trí xa hoa. Cấu trúc và bố cục cơ bản của căn phòng phải được bảo tồn.",
      gothic: "Giới thiệu các yếu tố kiến trúc Gothic như vòm nhọn, các đường kẻ phức tạp, và chi tiết trang trí công phu. Sử dụng một bảng màu tối, phong phú. Áp dụng những yếu tố phong cách này lên các bề mặt và đồ nội thất hiện có mà không làm thay đổi kích thước hoặc bố cục cơ bản của căn phòng.",
      neoclassical: "Áp dụng phong cách Tân cổ điển, nhấn mạnh trật tự, đối xứng và sự thanh lịch. Kết hợp các yếu-tố cổ-điển như phào chỉ trang trí, đồ nội thất lớn và một bảng màu nhẹ nhàng, êm dịu. Thiết kế phải tạo cảm giác trang trọng và vượt thời gian trong khi vẫn tôn trọng các ranh giới cấu trúc ban đầu của căn phòng.",
      deconstructivist: "Giới thiệu thẩm mỹ Giải tỏa kết cấu bằng cách thêm các yếu tố phân mảnh, phi tuyến tính và có vẻ hỗn loạn thông qua đồ nội thất và xử lý bề mặt. Mục tiêu là thách thức các quan niệm truyền thống về không gian, nhưng tính toàn vẹn cấu trúc và bố cục cốt lõi của căn phòng (tường, cửa sổ, cửa ra vào) phải được giữ nguyên.",
      biophilic: "Biến đổi không gian bằng các nguyên tắc thiết kế Biophilic (ưa tự nhiên). Tối đa hóa ánh sáng tự nhiên, kết hợp nhiều cây trồng trong nhà và tường cây, và sử dụng các vật liệu tự nhiên như gỗ và đá. Đồ nội thất nên có hình dạng hữu cơ. Thiết kế phải tích hợp với cấu trúc phòng hiện có, mang thiên nhiên vào bên trong mà không làm thay đổi bố cục.",
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
    promptPrefixes: {
      image_to_image: {
        [FeatureKey.SURREAL_EXTERIOR]: "Phân tích kỹ cấu trúc, bố cục và kết cấu của ảnh gốc. Đảm bảo giữ lại các yếu tố kiến trúc chính và không thay đổi đáng kể bố cục. Sau đó, biến đổi nó theo yêu cầu sau:",
        [FeatureKey.INSTANT_INTERIOR]: "Phân tích kỹ bố cục, cấu trúc và kết cấu của căn phòng trong ảnh. Đảm bảo giữ lại các yếu tố chính như cửa sổ, cửa ra vào, và không thay đổi đáng kể bố cục. Thiết kế lại nội thất theo yêu cầu sau:",
        [FeatureKey.MASTER_PLAN]: "Dựa trên bản đồ hoặc ảnh vệ tinh này, hãy tạo ra một bản quy hoạch tổng thể. Đảm bảo thiết kế của bạn tích hợp chặt chẽ với các đặc điểm hiện có trong ảnh. Yêu cầu chi tiết:",
        [FeatureKey.SKETCHUP_FINALIZE]: "Phân tích bản phác thảo hoặc mô hình đường nét này. Render nó thành một hình ảnh quang học, thêm vào các kết cấu và ánh sáng thực tế. TUYỆT ĐỐI KHÔNG thay đổi hình dạng kiến trúc cơ bản. Yêu cầu chi tiết:",
        [FeatureKey.PLAN_TO_3D]: "Dựa trên mặt bằng 2D này, hãy dựng một mô hình khối 3D. Mô hình phải phản ánh chính xác tỷ lệ và cách sắp xếp các phòng như trong bản vẽ. Yêu cầu chi tiết:",
        [FeatureKey.REAL_TO_TECH_DRAWING]: "Phân tích ảnh chụp thực tế này và chuyển đổi nó thành một bản vẽ kỹ thuật 2D. Bản vẽ phải thể hiện chính xác tỷ lệ và các chi tiết kiến trúc có trong ảnh. Yêu cầu chi tiết:",
        INSTANT_INTERIOR_PREFIX_CHECK: "Giữ nguyên cấu trúc",
      }
    },
    suggestionPrompts: {
      [FeatureKey.SURREAL_EXTERIOR]: "Bạn là một AI trợ lý kiến trúc. Phân tích hình ảnh ngoại thất này và đề xuất 3-4 prompt sáng tạo để biến đổi nó thành một phối cảnh siêu thực. Tập trung vào các thay đổi về vật liệu, ánh sáng, môi trường, hoặc phong cách kiến trúc.",
      [FeatureKey.INSTANT_INTERIOR]: "Bạn là một AI trợ lý thiết kế nội thất. Phân tích hình ảnh nội thất này và đề xuất 3-4 phong cách thiết kế khác nhau có thể áp dụng cho không gian này (ví dụ: Tối giản, Hiện đại giữa thế kỷ, Scandinavian, Công nghiệp).",
      [FeatureKey.MASTER_PLAN]: "Bạn là một AI trợ lý quy hoạch đô thị. Phân tích bản đồ/ảnh vệ tinh này và đề xuất 3-4 ý tưởng quy hoạch tổng thể khác nhau (ví dụ: khu dân cư mật độ cao, khu phức hợp thương mại, công viên trung tâm).",
      [FeatureKey.SMART_EDIT]: "Bạn là một AI trợ lý chỉnh sửa ảnh kiến trúc. Phân tích hình ảnh này và đề xuất 3-4 thay đổi cụ thể có thể thực hiện (ví dụ: 'thay đổi vật liệu tường thành gạch', 'thêm cây xanh ở ban công', 'làm cho bầu trời trong xanh hơn').",
      [FeatureKey.SKETCHUP_FINALIZE]: "Bạn là một AI chuyên gia render. Phân tích bản vẽ đường nét/sketchup này và đề xuất 3-4 kịch bản render khác nhau, tập trung vào vật liệu, ánh sáng ban ngày, hoặc bối cảnh (ví dụ: 'render với vật liệu bê tông và kính, ánh sáng ban ngày', 'đặt trong bối cảnh đô thị vào lúc hoàng hôn').",
      [FeatureKey.PLAN_TO_3D]: "Bạn là một AI chuyên gia mô hình hóa 3D. Phân tích mặt bằng 2D này và đề xuất 3-4 prompt để tạo mô hình 3D, tập trung vào các kiểu khối khác nhau (ví dụ: 'mô hình khối trắng đơn giản', 'mô hình 3D với vật liệu cơ bản', 'mô hình 3D cắt lớp để lộ nội thất').",
      [FeatureKey.REAL_TO_TECH_DRAWING]: "Bạn là một AI trợ lý kiến trúc sư. Phân tích hình ảnh công trình này và đề xuất 3-4 loại bản vẽ kỹ thuật có thể được tạo ra (ví dụ: 'tạo bản vẽ mặt đứng chính', 'vẽ chi tiết mặt cắt cửa sổ', 'phác thảo phối cảnh 2 điểm tụ').",
      detailedStructurePrompt: "Bạn là một AI phân tích kiến trúc. Hãy phân tích kỹ hình ảnh nội thất được cung cấp. Tạo ra một mô tả chi tiết về cấu trúc của không gian, bao gồm: cách bố trí phòng, vị trí và kiểu dáng của cửa sổ, cửa ra vào, cầu thang (nếu có), cột, dầm, và bất kỳ đặc điểm kiến trúc cố định nào khác. Bắt đầu mô tả của bạn bằng cụm từ 'Giữ nguyên cấu trúc phòng hiện có:'. Mô tả phải súc tích, chính xác và chỉ tập trung vào các yếu tố kiến trúc không thể thay đổi. Mục đích là để hướng dẫn một AI khác thiết kế lại nội thất mà không làm thay đổi các yếu tố kết cấu này.",
      default: "Phân tích hình ảnh này và đề xuất 3-4 prompt sáng tạo liên quan đến kiến trúc."
    },
    techDrawingOptions: {
      groupLabel: "Tùy chọn Bản vẽ Kỹ thuật",
      drawingScale: { label: "Tỷ lệ Bản vẽ", placeholder: "ví dụ: 1:100, 1:50" },
      lineThickness: {
        label: "Độ dày Nét vẽ",
        options: { thin: "Mỏng", medium: "Vừa", thick: "Dày" }
      },
      lineStyle: {
        label: "Kiểu Nét vẽ",
        options: { solid: "Nét liền", dashed: "Nét đứt", dotted: "Nét chấm" }
      },
      symbolLibrary: {
        label: "Thư viện Ký hiệu",
        options: { generic: "Chung", ansi: "ANSI (Mỹ)", iso: "ISO (Quốc tế)" }
      }
    },
    techDrawingSpecifications: ({ scale, thickness, style, library }) => `Hãy tuân thủ các thông số kỹ thuật sau: Tỷ lệ bản vẽ là ${scale}. Độ dày nét vẽ là ${thickness}. Kiểu nét vẽ là ${style}. Sử dụng thư viện ký hiệu kiến trúc ${library}.`,
    downloadImage: "Tải xuống Ảnh",
    editImage: "Chỉnh sửa Ảnh",
    refineImageTitle: "Tinh chỉnh Ảnh",
    refinePromptLabel: "Mô tả thay đổi",
    refinePromptPlaceholder: "ví dụ: làm cho bầu trời kịch tính hơn, thêm một cái cây ở bên trái",
    refineDecalLabel: "Ảnh chi tiết để thêm vào (tùy chọn)",
    refineButton: "Áp dụng",
    refiningButton: "Đang áp dụng...",
    refinedImageAlt: "Xem trước ảnh đã tinh chỉnh",
    saveAndReplace: "Lưu & Thay thế",
    makeAnotherChange: "Thay đổi khác",
    undoButton: "Hoàn tác",
    redoButton: "Làm lại",
    closeButton: "Đóng",
    refinedLabel: "Đã tinh chỉnh",
    footerText: "Copyright © No Border Place",
    errors: {
      promptRequired: "Vui lòng nhập yêu cầu.",
      promptOrStyleRequired: "Vui lòng nhập yêu cầu hoặc chọn một phong cách.",
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
        description: "The AI will change the style and furnishings of the input photo based on your prompt or chosen style, while preserving the main structure of the space.",
        promptPlaceholder: "e.g., Add a beige sofa, or leave blank and just select a style",
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
      [FeatureKey.REAL_TO_TECH_DRAWING]: {
        title: "Real Photo to 2D Tech Drawing",
        description: "Upload a real photo of a building. The AI will convert it into a technical drawing with professional lines, details, and symbols.",
        promptPlaceholder: "e.g., Cross-section drawing, aluminum and glass window details",
        imageUploadLabel: "Upload a Real Photo of the Building",
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
      [FeatureKey.REAL_TO_TECH_DRAWING]: "Convert a photograph of a building into a detailed 2D technical drawing.",
      [FeatureKey.COST_CALCULATION]: "Get a quick estimate of construction costs and area based on a description or drawing.",
      [FeatureKey.TASK_GENERATOR]: "Automatically generate to-do lists, categorized by worker type, with timelines for your project.",
      stylePreset: "Choose an architectural style to apply to the generated image.",
      negativePrompt: "Describe elements you want to exclude from the final image.",
      aspectRatio: "Define the width-to-height ratio of the final image.",
      detailLevel: "Control the amount of detail and complexity in the rendered output.",
      rerunPrompt: "Re-run with the same prompt and settings",
      tooltipCameraAngle: "Choose the virtual camera's perspective for the scene.",
      tooltipSetting: "Describe the environment, time of day, or atmosphere surrounding the subject.",
      detailedPromptTooltip: "Automatically generate a prompt that describes the image's structure in detail (doors, windows, etc.) to ensure the AI preserves these elements during redesign.",
    },
    promptLabel: "Prompt",
    analyzingForSuggestions: "Analyzing image for suggestions...",
    generateDetailedPrompt: "Suggest Detailed Prompt from Image",
    generatingDetailedPrompt: "Analyzing structure...",
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
    cameraAngleLabel: "Camera Angle",
    cameraAngles: {
      none: "Default",
      eye_level: "Eye-level View",
      low_angle: "Low-angle Shot",
      high_angle: "High-angle Shot",
      aerial: "Drone / Aerial View",
      close_up: "Close-up Detail",
      dutch_angle: "Dutch Angle / Canted",
      wide_angle: "Wide-angle Shot",
    },
    settingLabel: "Setting / Context",
    settingPlaceholder: "e.g., in a futuristic city, during a foggy morning, surrounded by a dense forest",
    negativePromptLabel: "Negative Prompt",
    negativePromptPlaceholder: "Things to avoid in the image, e.g., text, red color, ugly",
    stylePresetLabel: "Architectural Style",
    stylePresets: {
      none: "Default",
      photorealistic: "Photorealistic",
      minimalist: "Minimalist",
      modern: "Modern",
      brutalist: "Brutalist",
      art_deco: "Art Deco",
      gothic: "Gothic",
      neoclassical: "Neoclassical",
      deconstructivist: "Deconstructivist",
      biophilic: "Biophilic / Organic",
    },
    stylePresetDescriptions: {
      photorealistic: "Transform the space with photorealistic lighting, textures, and materials. The goal is a high-fidelity, life-like image that respects the original room's layout and architectural features.",
      minimalist: "Redesign the interior with a minimalist aesthetic. Focus on clean lines, simple geometric forms, and an uncluttered, serene space. Use a neutral or monochromatic color palette. Crucially, maintain the original room layout, including windows and doors.",
      modern: "Introduce a modern design style using materials like glass, steel, and polished concrete. Emphasize open space within the existing layout, simple color palettes, and clean, geometric furniture. Do not alter the room's core structure.",
      brutalist: "Reimagine the interior in a Brutalist style. Feature raw, exposed concrete, large blocky forms, and a monolithic, imposing feel. The design should feel honest about its materials while preserving the existing architectural shell of the room.",
      art_deco: "Infuse the space with the glamour of Art Deco. Introduce bold geometric patterns, symmetrical designs, rich materials like polished metal and exotic wood, and lavish ornamentation. The underlying structure and layout of the room must be preserved.",
      gothic: "Introduce Gothic architectural elements such as pointed arches, intricate tracery, and ornate details. Use a palette of dark, rich colors. Apply these stylistic elements to the existing surfaces and furnishings without changing the fundamental room dimensions or layout.",
      neoclassical: "Apply a Neoclassical style, emphasizing order, symmetry, and elegance. Incorporate classical elements like decorative moldings, grand furniture, and a calm, muted color palette. The design should feel grand and timeless while respecting the room's original structural boundaries.",
      deconstructivist: "Introduce a Deconstructivist aesthetic by adding fragmented, non-linear, and seemingly chaotic elements through furniture and surface treatments. The goal is to challenge traditional notions of space, but the core structural integrity and layout of the room (walls, windows, doors) must remain intact.",
      biophilic: "Transform the space using Biophilic design principles. Maximize natural light, incorporate abundant indoor plants and living walls, and use natural materials like wood and stone. Furniture should feature organic shapes. The design must integrate with the existing room structure, bringing nature inside without altering the layout.",
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
    promptPrefixes: {
      image_to_image: {
        [FeatureKey.SURREAL_EXTERIOR]: "Carefully analyze the architectural elements in the source image. Retain the main structure and layout, then transform it according to the following prompt:",
        [FeatureKey.INSTANT_INTERIOR]: "Carefully analyze the layout and structure of the room in the image. Keep the core elements (windows, doors) intact, and redesign the interior according to the following request:",
        [FeatureKey.MASTER_PLAN]: "Using this map or satellite image as a base, create a master plan. Ensure your design integrates tightly with the existing features shown in the image. Detailed request:",
        [FeatureKey.SKETCHUP_FINALIZE]: "Analyze this sketch or line model. Render it into a photorealistic image, adding realistic textures and lighting. STRICTLY DO NOT change the underlying architectural shape. Detailed request:",
        [FeatureKey.PLAN_TO_3D]: "Based on this 2D floor plan, extrude a 3D block model. The model must accurately reflect the proportions and arrangement of rooms as shown in the drawing. Detailed request:",
        [FeatureKey.REAL_TO_TECH_DRAWING]: "Analyze this real photograph and convert it into a 2D technical drawing. The drawing must accurately represent the proportions and architectural details present in the photo. Detailed request:",
        INSTANT_INTERIOR_PREFIX_CHECK: "Maintain the existing",
      }
    },
    suggestionPrompts: {
      [FeatureKey.SURREAL_EXTERIOR]: "You are an architectural assistant AI. Analyze this exterior image and suggest 3-4 creative prompts to transform it into a surreal render. Focus on changes to materials, lighting, environment, or architectural style.",
      [FeatureKey.INSTANT_INTERIOR]: "You are an interior designer AI. Analyze this interior photo and suggest 3-4 different design styles that could be applied to this space (e.g., Minimalist, Mid-century Modern, Scandinavian, Industrial).",
      [FeatureKey.MASTER_PLAN]: "You are an urban planner AI. Analyze this map/satellite image and suggest 3-4 different master plan concepts (e.g., high-density residential, mixed-use commercial center, central park).",
      [FeatureKey.SMART_EDIT]: "You are an architectural photo editing AI. Analyze this image and suggest 3-4 specific, concrete changes that could be made (e.g., 'change wall material to brick', 'add plants to the balcony', 'make the sky clearer').",
      [FeatureKey.SKETCHUP_FINALIZE]: "You are a rendering specialist AI. Analyze this line drawing/sketchup model and suggest 3-4 different rendering scenarios focusing on materials, time of day, or context (e.g., 'render with concrete and glass materials, daylight', 'place in an urban context at dusk').",
      [FeatureKey.PLAN_TO_3D]: "You are a 3D modeling AI. Analyze this 2D floor plan and suggest 3-4 prompts for creating a 3D model, focusing on different block styles (e.g., 'simple white block model', '3D model with basic materials', 'cut-away 3D model showing interior').",
      [FeatureKey.REAL_TO_TECH_DRAWING]: "You are an architectural assistant AI. Analyze this building photo and suggest 3-4 types of technical drawings that could be generated from it (e.g., 'create a front elevation drawing', 'draw a detailed window cross-section', 'sketch a 2-point perspective').",
      detailedStructurePrompt: "You are an architectural analysis AI. Analyze the provided interior image. Generate a detailed description of the space's structure, including: room layout, position and style of windows, doors, stairs (if any), columns, beams, and other fixed architectural features. Start your description with 'Maintain the existing room structure:'. The description must be concise, accurate, and focus only on immutable architectural elements. The purpose is to guide another AI to redesign the interior without altering these structural components.",
      default: "Analyze this image and provide 3-4 creative, architecture-related prompt suggestions."
    },
    techDrawingOptions: {
      groupLabel: "Technical Drawing Options",
      drawingScale: { label: "Drawing Scale", placeholder: "e.g., 1:100, 1:50" },
      lineThickness: {
        label: "Line Thickness",
        options: { thin: "Thin", medium: "Medium", thick: "Thick" }
      },
      lineStyle: {
        label: "Line Style",
        options: { solid: "Solid", dashed: "Dashed", dotted: "Dotted" }
      },
      symbolLibrary: {
        label: "Symbol Library",
        options: { generic: "Generic", ansi: "ANSI (American)", iso: "ISO (International)" }
      }
    },
    techDrawingSpecifications: ({ scale, thickness, style, library }) => `Adhere to the following drawing specifications: The drawing scale is ${scale}. The line thickness should be ${thickness}. The line style should be ${style}. Use the ${library} architectural symbol library.`,
    downloadImage: "Download Image",
    editImage: "Edit Image",
    refineImageTitle: "Refine Image",
    refinePromptLabel: "Describe your changes",
    refinePromptPlaceholder: "e.g., make the sky more dramatic, add a tree on the left",
    refineDecalLabel: "Detail image to add (optional)",
    refineButton: "Apply",
    refiningButton: "Applying...",
    refinedImageAlt: "Refined image preview",
    saveAndReplace: "Save & Replace",
    makeAnotherChange: "Make Another Change",
    undoButton: "Undo",
    redoButton: "Redo",
    closeButton: "Close",
    refinedLabel: "Refined",
    footerText: "Copyright © No Border Place",
    errors: {
      promptRequired: "Please enter a prompt.",
      promptOrStyleRequired: "Please enter a prompt or select a style.",
      imageRequired: "Please upload an image for this feature.",
      bothImagesRequired: "Please upload both the main image and the detail image for this feature.",
      general: (message: string) => `An error occurred: ${message}`,
      noImageGenerated: "No image was generated. The model may have refused the prompt.",
    },
  },
};