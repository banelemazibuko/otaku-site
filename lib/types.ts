export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AnimeItem {
  malId: number;
  title: string;
  imageUrl: string;
  score?: number;
  episodes?: number;
  synopsis?: string;
}
