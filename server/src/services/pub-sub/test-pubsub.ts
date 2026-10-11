import logger from "@/config/logger.js";
import type PubSubService from "./types.js";

export class TestPubSub implements PubSubService {
  validatePayload(_payload: Record<string, unknown>): boolean {
    return true;
  }

  publish(topicId: string, _payload: Record<string, unknown>): Promise<string> {
    logger.info(`Local Pub/Sub stub accepted a message for ${topicId}`);
    return Promise.resolve(`published to ${topicId} successfully`);
  }
}
