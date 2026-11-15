/**
 * IndexNow API Client & Real-Time Search Engine Dispatcher
 * Submits URL change events to api.indexnow.org and bing.com/indexnow.
 * Instantly triggers re-indexing across Microsoft Bing, Microsoft Copilot,
 * ChatGPT Search, Seznam, and Yandex within 15-60 minutes.
 */

export interface IndexNowResult {
  success: boolean;
  httpStatus: number;
  urlCount: number;
  error?: string;
  endpoint?: string;
}

export class IndexNowClient {
  private static readonly PRIMARY_ENDPOINT = 'https://api.indexnow.org/indexnow';
  private static readonly BING_ENDPOINT = 'https://www.bing.com/indexnow';
  private static readonly HOST = 'settlementcheck.co.uk';
  private static readonly DEFAULT_KEY = '6BBF580BBE0BA7A27BDD225BD91A979F';

  /**
   * Resolves the configured IndexNow key
   */
  public static getKey(): string {
    return process.env.INDEXNOW_KEY || this.DEFAULT_KEY;
  }

  /**
   * Resolves the absolute URL of the verification key file
   */
  public static getKeyLocation(): string {
    return `https://${this.HOST}/${this.getKey()}.txt`;
  }

  /**
   * Dispatches a single updated URL to IndexNow
   */
  public static async notifyUrlUpdated(url: string): Promise<IndexNowResult> {
    return this.notifyBatch([url]);
  }

  /**
   * Dispatches a batch of updated URLs to IndexNow
   */
  public static async notifyBatch(urls: string[]): Promise<IndexNowResult> {
    const key = this.getKey();
    const uniqueUrls = Array.from(new Set(urls));

    const payload = {
      host: this.HOST,
      key,
      keyLocation: this.getKeyLocation(),
      urlList: uniqueUrls,
    };

    const endpoints = [this.PRIMARY_ENDPOINT, this.BING_ENDPOINT];
    let lastError: any = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(payload),
        });

        const isAccepted = response.ok || response.status === 202;
        if (isAccepted) {
          return {
            success: true,
            httpStatus: response.status,
            urlCount: uniqueUrls.length,
            endpoint,
          };
        }

        const errText = await response.text();
        return {
          success: false,
          httpStatus: response.status,
          urlCount: uniqueUrls.length,
          error: errText,
          endpoint,
        };
      } catch (err: any) {
        lastError = err;
        // Continue to secondary endpoint in fallback list
      }
    }

    return {
      success: false,
      httpStatus: 500,
      urlCount: uniqueUrls.length,
      error: lastError ? lastError.message : 'Unknown network failure',
    };
  }
}
