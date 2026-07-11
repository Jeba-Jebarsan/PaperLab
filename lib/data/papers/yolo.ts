import type { Paper } from "../types";

export const yoloPaper: Paper = {
  id: "1506.02640",
  slug: "you-only-look-once",
  arxivId: "1506.02640",
  title: "You Only Look Once: Unified, Real-Time Object Detection",
  authors: ["Joseph Redmon", "Santosh Divvala", "Ross Girshick", "Ali Farhadi"],
  year: 2015,
  venue: "CVPR 2016",
  citationCount: 55000,
  tags: ["Computer Vision", "Object Detection", "Real-Time", "One-Stage", "Foundational"],
  abstract:
    "We present YOLO, a new approach to object detection. Prior work on object detection repurposes classifiers to perform detection. Instead, we frame object detection as a regression problem to spatially separated bounding boxes and associated class probabilities. A single neural network predicts bounding boxes and class probabilities directly from full images in one evaluation. Since the whole detection pipeline is a single network, it can be optimized end-to-end directly on detection performance. Our unified architecture is extremely fast: the base YOLO model processes images in real-time at 45 frames per second.",
  oneLiner:
    "This paper reframed object detection as a single glance — one neural network looks at an image once and outputs every object's location and class, fast enough for live video.",
  readingTime: "10 min interactive",
  difficulty: "Foundational",

  explainLevels: {
    beginner: [
      {
        heading: "One glance, not a thousand looks",
        body: "Before YOLO, computers found objects the slow way: cut the photo into thousands of little regions, and ask 'is this a dog?' about each one, one at a time. YOLO works like your eyes do — it looks at the whole picture once and instantly says 'dog here, car there, person over there'. That's literally the name: You Only Look Once.",
      },
      {
        heading: "The grid trick",
        body: "YOLO lays an invisible 7-by-7 grid over the picture. Each grid square has one job: 'if an object's center lands on me, I must report it.' Every square simultaneously guesses a box around its object, how confident it is, and what the object is. All 49 squares answer at the same time — that's why it's so fast.",
      },
      {
        heading: "Why speed changed everything",
        body: "YOLO could process 45 pictures every second — faster than video plays. Suddenly computers could watch the world live: a self-driving car can't wait 20 seconds to notice a pedestrian. Almost every real-time camera AI you see today descends from this idea.",
      },
    ],
    developer: [
      {
        heading: "Detection as regression",
        body: "YOLO replaces the multi-stage detection pipeline with a single CNN that maps a 448×448 image directly to a 7×7×30 tensor. Each of the 49 grid cells predicts B=2 bounding boxes (x, y, w, h, confidence) plus 20 class probabilities (PASCAL VOC). Confidence is trained to equal Pr(Object) × IoU with the ground truth, so it scores both objectness and box quality in one number.",
      },
      {
        heading: "Network and training",
        body: "The backbone is 24 convolutional layers inspired by GoogLeNet (using 1×1 reduction layers instead of inception modules) followed by 2 fully connected layers. It's pretrained for classification on ImageNet at 224×224, then the resolution is doubled to 448×448 for detection. Training uses leaky ReLU (slope 0.1), dropout 0.5, heavy augmentation, and a sum-squared error loss with λ_coord = 5 and λ_noobj = 0.5 to balance box regression against the many empty cells.",
      },
      {
        heading: "Inference and performance",
        body: "At test time: forward pass → per-box class scores (class probability × confidence) → threshold → Non-Maximum Suppression to merge duplicates. Results on VOC 2007: 63.4 mAP at 45 fps (Fast YOLO: 52.7 mAP at 155 fps), versus Faster R-CNN's 73.2 mAP at ~7 fps — less accurate, but an order of magnitude faster, and accurate enough to be useful in real time.",
      },
    ],
    researcher: [
      {
        heading: "Context and contribution",
        body: "Contemporary detectors were two-stage: generate region proposals, then classify each (R-CNN, Fast/Faster R-CNN), or slide classifiers exhaustively (DPM). Each component was trained separately and inference was expensive. YOLO's contribution is architectural unification — detection posed as single-pass regression, optimized end-to-end on detection loss directly. Because the network sees the entire image, it encodes contextual and global information that proposal-based methods lose.",
      },
      {
        heading: "Error profile",
        body: "The error analysis (vs Fast R-CNN) is the paper's most instructive result: YOLO's dominant failure is localization (19.0% of its errors vs 8.6% for Fast R-CNN), while it makes far fewer background false positives (4.75% vs 13.6%) thanks to global reasoning. The profiles are complementary — ensembling Fast R-CNN with YOLO adds 3.2 mAP. YOLO also generalizes better to out-of-domain imagery (artwork), suggesting it learns more holistic object representations.",
      },
      {
        heading: "Limitations and legacy",
        body: "The spatial constraint — each cell predicts only 2 boxes and one class — caps recall on small, grouped objects (the paper's example: flocks of birds). Coarse 7×7 features and the sum-squared loss (which the √w, √h trick only partially fixes for scale sensitivity) limit localization precision. These weaknesses defined the one-stage research agenda that followed: SSD, RetinaNet and focal loss, anchor boxes in YOLOv2, and the long YOLO family line that still dominates real-time detection today.",
      },
    ],
  },

  psi: {
    problem: {
      title: "Detection was a slow, glued-together pipeline",
      points: [
        "Systems repurposed classifiers: propose ~2,000 regions, run each through a CNN separately.",
        "Multi-stage pipelines (proposals → features → classifier → box refinement) were trained piece by piece.",
        "Even the fastest accurate detector (Faster R-CNN) managed only ~7 frames per second.",
      ],
      analogy:
        "Like finding your keys by photographing every square inch of the room and examining the photos one by one.",
    },
    solution: {
      title: "One network, one look, end to end",
      points: [
        "Lay a 7×7 grid on the image; every cell predicts boxes, confidence, and class simultaneously.",
        "The whole pipeline is a single CNN trained end-to-end on detection performance.",
        "Seeing the full image at once gives global context — fewer 'ghost' detections in the background.",
      ],
      analogy:
        "Like glancing at the room once and your brain instantly tagging everything: keys, phone, cat.",
    },
    impact: {
      title: "Real-time vision became standard",
      points: [
        "45 fps made detection usable on live video — robotics, driving, surveillance, sports.",
        "Founded the one-stage detector family: SSD, RetinaNet, and YOLOv2 through today's YOLOs.",
        "Its speed-first philosophy still defines deployed computer vision a decade later.",
      ],
      analogy:
        "The moment computer vision went from developing photos in a darkroom to seeing live.",
    },
  },

  architecture: {
    nodes: [
      {
        id: "input",
        label: "Input Image",
        sublabel: "448 × 448 × 3",
        kind: "io",
        description:
          "The full photo, resized to 448×448 pixels. Unlike proposal-based systems, YOLO will only ever process this image once, whole.",
        example:
          "A street scene with a car, a person, and a dog — all will be found in one pass.",
        detail:
          "Resolution is doubled from the 224×224 used in ImageNet pretraining, because detection needs fine-grained spatial detail that classification doesn't.",
      },
      {
        id: "backbone",
        label: "Convolutional Backbone",
        sublabel: "24 conv layers",
        kind: "core",
        description:
          "A deep stack of convolution and pooling layers extracts visual features — edges, textures, parts, objects — while shrinking the image spatially.",
        example:
          "Early layers light up for edges and colors; deeper layers respond to wheels, faces, and fur (exactly what the CNN Lab below demonstrates).",
        detail:
          "Inspired by GoogLeNet, but uses cheap 1×1 'reduction' convolutions instead of inception modules. The first 20 layers are pretrained on ImageNet classification for a week, then 4 conv layers and the detection head are added.",
      },
      {
        id: "grid",
        label: "Feature Grid",
        sublabel: "7 × 7 × 1024",
        kind: "process",
        description:
          "After all the convolutions, the image has been distilled to a 7×7 grid of feature vectors — one rich 1024-number summary per region of the image.",
        example:
          "The cell covering the car's center now holds features screaming 'metallic, wheels, boxy shape'.",
        detail:
          "This is where the grid responsibility rule comes from: the spatial layout of these features maps directly onto the 7×7 prediction grid.",
      },
      {
        id: "fc",
        label: "Fully Connected Layers",
        sublabel: "4096 → 7×7×30",
        kind: "core",
        description:
          "Two dense layers mix information from the entire image at once — this is where global reasoning happens — then reshape into the final prediction tensor.",
        example:
          "Because these layers see everything, YOLO rarely mistakes a patch of empty road for a car — it knows what the whole scene looks like.",
        detail:
          "This global view is why YOLO makes 3× fewer background false positives than Fast R-CNN (4.75% vs 13.6% in the paper's error analysis).",
      },
      {
        id: "tensor",
        label: "Prediction Tensor",
        sublabel: "7 × 7 × 30",
        kind: "core",
        description:
          "The entire answer, in one block of numbers: each of the 49 grid cells outputs 2 candidate boxes (x, y, w, h, confidence) plus 20 class probabilities.",
        example:
          "Cell (4,3): 'box at these coordinates, 91% sure it's an object, and it's most likely a car.'",
        detail:
          "30 = 2 boxes × 5 numbers + 20 PASCAL VOC class probabilities. Note each cell predicts one class distribution shared by its boxes — the root of YOLO's small-object weakness.",
      },
      {
        id: "confidence",
        label: "Confidence Scoring",
        sublabel: "Pr(Object) × IoU",
        kind: "process",
        description:
          "Each box's confidence multiplies with the class probabilities to give class-specific scores. Weak guesses get filtered out by a threshold.",
        example:
          "A box with 0.4 objectness × 0.3 'dog' probability scores 0.12 — below threshold, discarded.",
        detail:
          "Confidence is trained to predict the IoU with ground truth, so it measures both 'is something here?' and 'how good is my box?' in a single number.",
      },
      {
        id: "nms",
        label: "Non-Maximum Suppression",
        sublabel: "merge duplicates",
        kind: "process",
        description:
          "Nearby cells often report the same object. NMS keeps only the highest-confidence box among heavily-overlapping ones of the same class.",
        example:
          "Three boxes on the same car → the 94% one survives, the 81% and 57% ones are suppressed (try it live in the Detection Lab above).",
        detail:
          "NMS adds 2–3% mAP. Overlap is measured with IoU — the same geometry you can manipulate with the IoU slider in the simulator.",
      },
      {
        id: "output",
        label: "Final Detections",
        sublabel: "boxes + labels + scores",
        kind: "io",
        description:
          "The clean result: one labeled, scored box per real object. The whole journey from pixels to here took a single network evaluation — about 22 milliseconds.",
        example: "car 94% · person 89% · dog 68% — at 45 frames per second.",
        detail:
          "Fast YOLO (9 conv layers) runs at 155 fps with 52.7 mAP — the fastest detector of its era by a wide margin.",
      },
    ],
    edges: [
      { source: "input", target: "backbone" },
      { source: "backbone", target: "grid" },
      { source: "grid", target: "fc" },
      { source: "fc", target: "tensor" },
      { source: "tensor", target: "confidence" },
      { source: "confidence", target: "nms" },
      { source: "nms", target: "output" },
    ],
  },

  math: [
    {
      id: "confidence",
      name: "Box Confidence",
      formula: "C = \\Pr(\\text{Object}) \\cdot \\text{IoU}_{\\text{pred}}^{\\text{truth}}",
      meaning:
        "A box's confidence should be high only when BOTH things are true: an object really is there, and the predicted box overlaps it well. If no object exists, confidence should be zero.",
      analogy:
        "A witness statement scored on two things at once: are you sure you saw something, and how precisely can you point to where it was?",
      breakdown: [
        { symbol: "\\Pr(\\text{Object})", meaning: "Probability that any object's center falls in this grid cell." },
        { symbol: "\\text{IoU}_{\\text{pred}}^{\\text{truth}}", meaning: "How well the predicted box overlaps the true box (0 = no overlap, 1 = perfect)." },
      ],
    },
    {
      id: "class-score",
      name: "Class-Specific Score",
      formula:
        "\\Pr(\\text{Class}_i \\mid \\text{Object}) \\cdot \\Pr(\\text{Object}) \\cdot \\text{IoU} = \\Pr(\\text{Class}_i) \\cdot \\text{IoU}",
      meaning:
        "At test time, each cell's class probabilities multiply with each box's confidence. The result scores 'this specific class, in this specific box' — the number the confidence slider in the Detection Lab thresholds.",
      analogy:
        "Chained certainty: (sure it's a dog, given something's there) × (sure something's there) × (sure about where) = one final trust score.",
      breakdown: [
        { symbol: "\\Pr(\\text{Class}_i \\mid \\text{Object})", meaning: "If there's an object here, how likely is it class i? (One set of 20 per cell.)" },
        { symbol: "\\Pr(\\text{Object})", meaning: "The box's objectness — is anything actually here?" },
        { symbol: "\\text{IoU}", meaning: "Predicted box quality, folded into the same score." },
      ],
    },
    {
      id: "iou",
      name: "Intersection over Union (IoU)",
      formula: "\\text{IoU}(A, B) = \\frac{|A \\cap B|}{|A \\cup B|}",
      meaning:
        "The standard measure of how much two boxes agree: the area where they overlap, divided by the total area they cover together. 1 means identical boxes; 0 means no contact.",
      analogy:
        "Two people circle the same dog on a photo with markers. IoU asks: of all the ink on the page, what fraction is double-inked? That's their agreement.",
      breakdown: [
        { symbol: "A \\cap B", meaning: "The overlap region — where both boxes agree." },
        { symbol: "A \\cup B", meaning: "The combined region — everything either box claims." },
      ],
    },
    {
      id: "loss",
      name: "Localization Loss (with the √ trick)",
      formula:
        "\\lambda_{\\text{coord}} \\sum_{i=0}^{S^2} \\sum_{j=0}^{B} \\mathbb{1}_{ij}^{\\text{obj}} \\left[ (\\sqrt{w_i} - \\sqrt{\\hat{w}_i})^2 + (\\sqrt{h_i} - \\sqrt{\\hat{h}_i})^2 \\right]",
      meaning:
        "Box size errors are punished on the square root of width and height, not the raw values — so being 10 pixels off on a tiny box hurts much more than 10 pixels off on a huge box. λ_coord = 5 makes box accuracy matter more than the many empty cells.",
      analogy:
        "Missing a dartboard by 10 cm is embarrassing; missing a football goal by 10 cm is fine. The √ makes the loss judge errors relative to the target's size.",
      breakdown: [
        { symbol: "\\lambda_{\\text{coord}} = 5", meaning: "Weight that boosts box-coordinate errors over the (many) cells with no object (λ_noobj = 0.5 shrinks those)." },
        { symbol: "\\mathbb{1}_{ij}^{\\text{obj}}", meaning: "Indicator: 1 only for the box responsible for a real object, 0 otherwise." },
        { symbol: "\\sqrt{w}, \\sqrt{h}", meaning: "The square-root trick — equal pixel errors matter more on small boxes than large ones." },
      ],
    },
  ],

  applications: [
    {
      icon: "eye",
      title: "Autonomous driving",
      description:
        "Perception stacks must find pedestrians, cars, and signs in every frame with millisecond budgets — the exact real-time constraint YOLO was built for.",
    },
    {
      icon: "search",
      title: "Security & surveillance",
      description:
        "Live camera feeds are monitored by one-stage detectors flagging people, vehicles, and objects across thousands of streams simultaneously.",
    },
    {
      icon: "message-square",
      title: "Sports analytics",
      description:
        "Player, ball, and event tracking in broadcast video runs on YOLO-family detectors — fast enough to follow the action live.",
    },
    {
      icon: "dna",
      title: "Medical & scientific imaging",
      description:
        "Detecting cells in microscopy, lesions in scans, and wildlife in drone footage all use one-stage detection descended from this paper.",
    },
    {
      icon: "code",
      title: "Robotics & drones",
      description:
        "Robots grasping objects and drones avoiding obstacles need onboard, low-latency detection — Fast YOLO's 155 fps set the template.",
    },
    {
      icon: "languages",
      title: "Retail & industry",
      description:
        "Checkout-free stores, shelf monitoring, and factory quality control run continuous real-time detection on the YOLO lineage.",
    },
  ],

  codeExample: {
    language: "python",
    title: "YOLO post-processing: decode the grid + NMS",
    explanation:
      "The network's output is just a 7×7×30 block of numbers. This is the real post-processing that turns it into detections — scoring, thresholding, and Non-Maximum Suppression. It's the same math the Detection Lab's sliders control.",
    code: `import numpy as np

S, B, C = 7, 2, 20          # grid size, boxes per cell, classes


def iou(box_a, box_b):
    """Intersection over Union of two [x1, y1, x2, y2] boxes."""
    x1 = max(box_a[0], box_b[0]); y1 = max(box_a[1], box_b[1])
    x2 = min(box_a[2], box_b[2]); y2 = min(box_a[3], box_b[3])
    inter = max(0, x2 - x1) * max(0, y2 - y1)
    area_a = (box_a[2] - box_a[0]) * (box_a[3] - box_a[1])
    area_b = (box_b[2] - box_b[0]) * (box_b[3] - box_b[1])
    return inter / (area_a + area_b - inter)


def decode(pred, conf_thresh=0.25):
    """pred: (S, S, B*5 + C) tensor -> list of scored boxes."""
    boxes = []
    for row in range(S):
        for col in range(S):
            cell = pred[row, col]
            class_probs = cell[B * 5:]              # 20 class probabilities
            for b in range(B):
                x, y, w, h, conf = cell[b * 5 : b * 5 + 5]
                # class-specific score = Pr(Class|Obj) * Pr(Obj) * IoU
                scores = class_probs * conf
                cls = int(np.argmax(scores))
                if scores[cls] < conf_thresh:
                    continue                        # too unsure -> discard
                # (x, y) are relative to the cell; (w, h) to the image
                cx, cy = (col + x) / S, (row + y) / S
                boxes.append({
                    "box": [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2],
                    "score": float(scores[cls]),
                    "class": cls,
                })
    return boxes


def nms(boxes, iou_thresh=0.45):
    """Keep the best box per object; drop overlapping duplicates."""
    boxes = sorted(boxes, key=lambda d: d["score"], reverse=True)
    kept = []
    for cand in boxes:
        duplicate = any(
            k["class"] == cand["class"]
            and iou(k["box"], cand["box"]) > iou_thresh
            for k in kept
        )
        if not duplicate:
            kept.append(cand)
    return kept


# --- Try it on random 'network output' ---
pred = np.random.rand(S, S, B * 5 + C)
detections = nms(decode(pred))
print(f"{len(detections)} objects after decode + NMS")`,
  },

  chatSuggestions: [
    "Why is YOLO so much faster than R-CNN?",
    "What does each grid cell predict?",
    "What is Non-Maximum Suppression?",
    "What are YOLO's weaknesses?",
    "How accurate was YOLO compared to Faster R-CNN?",
  ],

  course: {
    title: "YOLO: real-time detection, from zero",
    description:
      "A 4-lesson mini course: why detection was slow, the single-glance idea, the cleanup math, and the honest trade-offs.",
    lessons: [
      {
        id: "lesson-1",
        number: 1,
        title: "Why detection was slow",
        duration: "6 min",
        summary: "A thousand looks per photo.",
        sections: [
          {
            heading: "Classifiers wearing a detective costume",
            body: "Before YOLO, object detection reused image classifiers — networks that answer 'what is this picture of?'. To find objects, systems showed the classifier thousands of crops of the same image: sliding windows at every position and scale (DPM), or ~2,000 'this might be something' region proposals (R-CNN). One photo meant thousands of separate neural network evaluations.",
          },
          {
            heading: "Pipelines, not systems",
            body: "R-CNN's pipeline had separate stages: propose regions, extract features, classify with SVMs, then refine boxes — each trained independently. Errors compounded between stages, tuning was painful, and even the streamlined Faster R-CNN topped out around 7 frames per second. Accurate, but you could not point it at live video.",
          },
          {
            heading: "The convolution foundation",
            body: "One thing did work brilliantly: convolutional feature extraction — sliding small filters across an image to find edges, textures, and parts (exactly what the CNN Lab below shows). YOLO's bet was that a convolutional backbone could feed a detector that decides everything in one shot, with no proposal stage at all.",
          },
        ],
        keyTakeaway:
          "Pre-YOLO detection = thousands of classifier calls glued into fragile multi-stage pipelines. Accurate but far too slow for live video.",
        quiz: {
          question: "Why was R-CNN-style detection so slow?",
          options: [
            { text: "The images were too large to fit in memory", correct: false, explanation: "Image size wasn't the issue — the number of evaluations was." },
            { text: "It ran the network separately on ~2,000 proposed regions per image", correct: true, explanation: "Exactly — thousands of forward passes per photo, plus separate pipeline stages, versus YOLO's single pass." },
            { text: "GPUs didn't exist yet", correct: false, explanation: "GPUs were standard by then — R-CNN used them. The architecture was the bottleneck." },
            { text: "It had too many parameters", correct: false, explanation: "Parameter count affects memory, not the fundamental cost of evaluating thousands of regions." },
          ],
        },
      },
      {
        id: "lesson-2",
        number: 2,
        title: "One grid, one glance",
        duration: "7 min",
        summary: "Detection becomes a single prediction.",
        sections: [
          {
            heading: "The responsibility grid",
            body: "YOLO divides the image into a 7×7 grid with a simple contract: whichever cell contains an object's center is responsible for detecting it. Every cell predicts 2 candidate boxes (position, size, confidence) and a set of 20 class probabilities — all 49 cells at once, in one forward pass.",
          },
          {
            heading: "One tensor holds every answer",
            body: "The network's entire output is a 7×7×30 block of numbers: 2 boxes × 5 values + 20 class probabilities per cell. Detection stopped being a pipeline and became regression — 'map pixels to this tensor' — trainable end-to-end with ordinary gradient descent on detection performance itself.",
          },
          {
            heading: "The global-context bonus",
            body: "Because the fully connected layers see the whole image at once, YOLO reasons globally. A proposal-based detector examining one crop can mistake a shadow for a car; YOLO, seeing the entire scene, rarely does — it makes about 3× fewer background false positives than Fast R-CNN (4.75% vs 13.6%).",
          },
        ],
        keyTakeaway:
          "A 7×7 grid where each cell owns the objects centered in it, all predicting simultaneously — detection as one regression, with global context for free.",
        quiz: {
          question: "Which grid cell is responsible for detecting an object?",
          options: [
            { text: "Every cell the object touches", correct: false, explanation: "That would create massive duplication — responsibility is assigned more precisely." },
            { text: "The cell containing the object's center point", correct: true, explanation: "Right — one owner per object. Large objects overlap many cells, but only the center cell must report them." },
            { text: "The four corner cells of the object's box", correct: false, explanation: "Corners don't assign responsibility — the center does." },
            { text: "A randomly chosen cell", correct: false, explanation: "Assignment is deterministic by center location, which is what makes training stable." },
          ],
        },
      },
      {
        id: "lesson-3",
        number: 3,
        title: "Confidence, IoU, and the cleanup",
        duration: "8 min",
        summary: "From 98 raw boxes to a clean answer.",
        sections: [
          {
            heading: "Confidence means two things at once",
            body: "Each box's confidence is trained to equal Pr(Object) × IoU — 'is something really here?' multiplied by 'how good is my box?'. Multiplying by class probability gives a final score per box per class. A threshold then discards weak guesses — exactly the confidence slider you can drag in the Detection Lab.",
          },
          {
            heading: "IoU: how boxes are judged",
            body: "Intersection over Union is the geometry of agreement: overlap area divided by combined area. IoU 1.0 = perfect box; 0 = complete miss. It appears twice in YOLO: inside the confidence target during training, and as the duplicate test during cleanup.",
          },
          {
            heading: "Non-Maximum Suppression",
            body: "Neighboring cells often report the same object — 49 cells × 2 boxes = 98 candidates for maybe 3 real objects. NMS fixes this: sort by confidence, keep the best box, delete any same-class box that overlaps it beyond the IoU threshold, repeat. In the paper it adds 2–3% mAP. You've already run this exact algorithm with the IoU slider.",
          },
        ],
        keyTakeaway:
          "Score = class probability × objectness × box quality. Threshold kills weak guesses; NMS kills duplicates. 98 raw boxes become a handful of clean detections.",
        quiz: {
          question: "What problem does Non-Maximum Suppression solve?",
          options: [
            { text: "The network being too slow", correct: false, explanation: "NMS is post-processing — it barely affects speed either way." },
            { text: "Multiple overlapping boxes reporting the same object", correct: true, explanation: "Exactly — neighboring cells double-report objects; NMS keeps only the most confident box per object." },
            { text: "Objects that are too small to see", correct: false, explanation: "Small objects are a YOLO weakness, but NMS doesn't address it — it only removes duplicates." },
            { text: "Blurry input images", correct: false, explanation: "NMS operates on boxes, not pixels." },
          ],
        },
      },
      {
        id: "lesson-4",
        number: 4,
        title: "The honest trade-offs",
        duration: "7 min",
        summary: "What one glance costs — and what it bought.",
        sections: [
          {
            heading: "Speed vs accuracy, with numbers",
            body: "On VOC 2007: YOLO scored 63.4 mAP at 45 fps; Fast YOLO 52.7 mAP at 155 fps; Faster R-CNN 73.2 mAP at ~7 fps. YOLO traded roughly 10 points of accuracy for a 6× speedup — and for live video, that trade wins, because a detector that arrives late is a detector that's wrong.",
          },
          {
            heading: "Where one glance fails",
            body: "Each cell predicts only 2 boxes and a single class, so YOLO struggles when many small objects crowd one cell — the paper's own example is a flock of birds. Its localization is also its biggest error source (19% of errors, vs 8.6% for Fast R-CNN): the 7×7 grid is coarse, and the √w/√h loss trick only partially fixes size sensitivity.",
          },
          {
            heading: "The lineage it started",
            body: "Every weakness became a successor's roadmap: YOLOv2 added anchor boxes and finer grids; SSD predicted at multiple scales; RetinaNet fixed the class-imbalance problem with focal loss. A decade on, YOLO-family models still dominate deployed real-time detection — the single-glance idea outlived every one of its original limitations.",
          },
        ],
        keyTakeaway:
          "YOLO traded ~10 mAP for 6× speed and won the real-time niche. Its known weaknesses (small grouped objects, coarse localization) set the agenda for a decade of one-stage detectors.",
        quiz: {
          question: "Which scene is hardest for the original YOLO?",
          options: [
            { text: "A single large car on an empty road", correct: false, explanation: "Large, lone objects are YOLO's easiest case — the center cell owns it cleanly." },
            { text: "A flock of small birds close together", correct: true, explanation: "The paper's own example: many small objects crowd into single cells, but each cell can only report 2 boxes of one class." },
            { text: "A photo taken at night", correct: false, explanation: "Lighting affects all detectors similarly — it's not YOLO's specific structural weakness." },
            { text: "An object in the center of the image", correct: false, explanation: "Center objects are handled exactly like any other — by whichever cell holds the center." },
          ],
        },
      },
    ],
  },
};
