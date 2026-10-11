interface PubSubService {
  publish(topicId: string, payload: Record<string, unknown>): Promise<string>;

  validatePayload(payload: Record<string, unknown>): boolean;
}

export default PubSubService;
