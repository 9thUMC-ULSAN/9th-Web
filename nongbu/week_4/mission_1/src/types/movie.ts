export type Movie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview:string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
};

export type MovieResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
};

// 장르 객체에 대한 타입
export type Genre = {
  id: number;
  name: string;
};

// 제작사 객체에 대한 타입
export type ProductionCompany = {
  id: number;
  logo_path: string | null; 
  name: string;
  origin_country: string;
};

// 제작 국가 객체에 대한 타입
export type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

// 사용 언어 객체에 대한 타입
export type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

// 영화 상세 정보 전체에 대한 타입
export type MovieDetails = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null | object; // null이거나 다른 객체가 올 수 있음
  budget: number;
  genres: Genre[]; // 위에서 만든 Genre 타입의 배열
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[]; // 위에서 만든 ProductionCompany 타입의 배열
  production_countries: ProductionCountry[]; // 위에서 만든 ProductionCountry 타입의 배열
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[]; // 위에서 만든 SpokenLanguage 타입의 배열
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type Credit = {
  adult: boolean,
  gender: number,
  id: number,
  known_for_department: string,
  name: string,
  original_name: string,
  popularity: number,
  profile_path: string | null,
  cast_id: number,
  character: string,
  credit_id: string,
  order: number,
}

export type CreditResponse = {
  id: number,
  cast: Credit[]
}