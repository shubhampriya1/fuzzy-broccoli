export type ArticleDataType = {
  pagination: PaginationType;
  data: Array<DataType>;
};

export type DataType = {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
  checked?: boolean;
};

export type PaginationType = {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
};
