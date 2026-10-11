// Google Cloud PubSub logic
import { PubSub } from "@google-cloud/pubsub";
import type PubSubService from "./types.js";
import env from "@/config/env.js";
import { z } from "zod";

const pubSubPayloadSchema = z.object({
  subscription: z.string(),
  message: z.object({
    data: z.string(),
    messageId: z.string(),
    attributes: z.record(z.string(), z.string()).optional(),
    publishTime: z.string().optional(),
  }),
});

type GCPPubSubPayload = z.infer<typeof pubSubPayloadSchema>;

const isPubSubPayload = (body: unknown): body is GCPPubSubPayload =>
  pubSubPayloadSchema.safeParse(body).success;

class GooglePubSubService implements PubSubService {
  private readonly projectId: string;
  private readonly client: PubSub;

  constructor(projectId: string) {
    this.projectId = projectId;
    this.client = new PubSub({ projectId });
  }

  static preparePublishPayload(payload: Record<string, unknown>): Buffer {
    const objectAsString = JSON.stringify(payload);
    return Buffer.from(objectAsString);
  }

  publish(topicId: string, payload: Record<string, unknown>): Promise<string> {
    const topicName = `projects/${this.projectId}/topics/${topicId}-${env.NODE_ENV}`;

    const topic = this.client.topic(topicName);

    return topic.publishMessage({
      data: GooglePubSubService.preparePublishPayload(payload),
    });
  }

  validatePayload(payload: Record<string, unknown>): boolean {
    return isPubSubPayload(payload);
  }
}

export type { GCPPubSubPayload };
export { isPubSubPayload, GooglePubSubService };
