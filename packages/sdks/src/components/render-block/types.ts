import { BuilderContextInterface } from '../../context/types.js';
import { BuilderBlock } from '../../types/builder-block.js';

export interface RepeatData {
  block: BuilderBlock;
  context: BuilderContextInterface;
}
