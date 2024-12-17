import { fetcher } from "../utils/fetcher";

const BASE_URL = "https://api.artic.edu/api/v1/artworks";

export class ArticleService {
  static async fetchArticle(pageNumber: number) {
    return await fetcher({
      url: `${BASE_URL}`,
      params: {
        page: pageNumber,
      },
    });
  }
}
