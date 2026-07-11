import type { StoryScene } from "../visual-story";
import { attentionStory } from "./attention-story";
import { gansStory } from "./gans-story";
import { alexnetStory } from "./alexnet-story";
import { resnetStory } from "./resnet-story";
import { yoloStory } from "./yolo-story";
import { bertStory } from "./bert-story";
import { gpt3Story } from "./gpt3-story";
import { rlhfStory } from "./rlhf-story";
import { loraStory } from "./lora-story";
import { vitStory } from "./vit-story";

/**
 * Visual stories per paper — bespoke animated picture-book walkthroughs.
 * Papers without a story yet simply skip the section (more coming each
 * iteration of the visual-upgrade loop).
 */
const STORIES: Record<string, StoryScene[]> = {
  "1706.03762": attentionStory,
  "1406.2661": gansStory,
  "alexnet-2012": alexnetStory,
  "1512.03385": resnetStory,
  "1506.02640": yoloStory,
  "1810.04805": bertStory,
  "2005.14165": gpt3Story,
  "2009.01325": rlhfStory,
  "2106.09685": loraStory,
  "2010.11929": vitStory,
};

export function getStory(paperId: string): StoryScene[] | undefined {
  return STORIES[paperId];
}
