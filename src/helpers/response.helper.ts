export class ResponseHelper {
  public static handleErrorStatus(response: Response): Response {
    if (response.status >= 400) {
      throw new Error(`Unexpected HTTP status code (${response.status})`)
    }
    return response
  }
}
