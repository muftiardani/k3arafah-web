import api from "@/lib/api";

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

export interface CreateGalleryData {
  title: string;
  description: string;
  event_date: string; // YYYY-MM-DD
}

export const getAllGalleries = async (): Promise<Gallery[]> => {
  try {
    const res = await api.get("/galleries");
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to fetch galleries:", error);
    return [];
  }
};

export const getGalleryDetail = async (id: number): Promise<Gallery | null> => {
  try {
    const res = await api.get(`/galleries/${id}`);
    return res.data.data || null;
  } catch (error) {
    console.error(`Failed to fetch gallery ${id}:`, error);
    return null;
  }
};

export const createGallery = async (data: CreateGalleryData): Promise<Gallery> => {
  try {
    const res = await api.post("/galleries", data);
    return res.data.data;
  } catch (error) {
    console.error("Failed to create gallery:", error);
    throw error;
  }
};

export const deleteGallery = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/galleries/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete gallery:", error);
    throw error;
  }
};

export const uploadGalleryPhoto = async (galleryId: number, file: File): Promise<GalleryPhoto> => {
  try {
    const formData = new FormData();
    formData.append("file", file); // key 'file' must match backend
    formData.append("gallery_id", galleryId.toString());

    // Content-Type multipart/form-data is handled automatically by axios when passing FormData
    // But our interceptor adds application/json. Axios usually overrides it if datsa is FormData.
    const res = await api.post(`/galleries/${galleryId}/photos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to upload photo:", error);
    throw error;
  }
};

export const deleteGalleryPhoto = async (photoId: number): Promise<boolean> => {
  try {
    await api.delete(`/galleries/photos/${photoId}`);
    return true;
  } catch (error) {
    console.error("Failed to delete photo:", error);
    throw error;
  }
};
