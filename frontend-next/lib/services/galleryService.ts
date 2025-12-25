import axios from "axios";

export interface GalleryPhoto {
  id: number;
  url: string;
  gallery_id: number;
  created_at: string;
}

export interface Gallery {
  id: number;
  title: string;
  description: string;
  event_date: string;
  photos: GalleryPhoto[];
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const getAllGalleries = async (): Promise<Gallery[]> => {
  try {
    const res = await axios.get(`${API_URL}/galleries`);
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to fetch galleries:", error);
    return [];
  }
};

export const getGalleryDetail = async (id: number): Promise<Gallery | null> => {
  try {
    const res = await axios.get(`${API_URL}/galleries/${id}`);
    return res.data.data || null;
  } catch (error) {
    console.error(`Failed to fetch gallery ${id}:`, error);
    return null;
  }
};
