import { notFound } from "next/navigation";

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  is_published: boolean;
  published_at: string;
  author_id: number;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    username: string;
    email: string;
    name: string;
    role: string;
  };
};

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles: Article[] = [
    {
      id: 1,
      slug: "penerimaan-santri-baru-2025",
      title: "Penerimaan Santri Baru Tahun Ajaran 2025/2026",
      excerpt: "Pondok Pesantren K3 Arafah membuka pendaftaran santri baru...",
      content: "<p>Detail konten pendaftaran...</p>",
      image: "/images/article-psb.png",
      is_published: true,
      published_at: "2025-01-01T08:00:00Z",
      author_id: 1,
      created_at: "2024-12-25T00:00:00Z",
      updated_at: "2024-12-25T00:00:00Z",
      author: {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        name: "Admin",
        role: "admin",
      },
    },
    {
      id: 2,
      slug: "kegiatan-ramadhan-di-pesantren",
      title: "Semarak Kegiatan Ramadhan di Pesantren",
      excerpt: "Berbagai kegiatan positif mengisi bulan suci Ramadhan...",
      content: "<p>Detail kegiatan ramadhan...</p>",
      image: "/images/article-ramadhan.png",
      is_published: true,
      published_at: "2025-03-10T08:00:00Z",
      author_id: 2,
      created_at: "2025-03-01T00:00:00Z",
      updated_at: "2025-03-01T00:00:00Z",
      author: {
        id: 2,
        username: "ustadz_hanif",
        email: "hanif@example.com",
        name: "Ustadz Hanif",
        role: "editor",
      },
    },
    {
      id: 3,
      slug: "prestasi-santri-tingkat-provinsi",
      title: "Alhamdulillah, Santri K3 Arafah Raih Juara 1 MQK Provinsi",
      excerpt: "Selamat kepada Ananda Fulan bin Fulan atas prestasinya...",
      content: "<p>Detail prestasi...</p>",
      image: "/images/article-achievement.png",
      is_published: true,
      published_at: "2025-02-15T08:00:00Z",
      author_id: 1,
      created_at: "2025-02-10T00:00:00Z",
      updated_at: "2025-02-10T00:00:00Z",
      author: {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        name: "Admin",
        role: "admin",
      },
    },
    {
      id: 4,
      slug: "kunjungan-syeikh-mesir",
      title: "Kunjungan Syeikh dari Universitas Al-Azhar Mesir",
      excerpt: "Membangun kerjasama pendidikan internasional...",
      content: "<p>Detail kunjungan...</p>",
      image: "/images/article-visit.png",
      is_published: true,
      published_at: "2025-01-20T08:00:00Z",
      author_id: 3,
      created_at: "2025-01-15T00:00:00Z",
      updated_at: "2025-01-15T00:00:00Z",
      author: {
        id: 3,
        username: "humas",
        email: "humas@example.com",
        name: "Humas",
        role: "editor",
      },
    },
  ];

  const article = articles.find((a) => a.slug === slug);
  return article || null;
}

export async function getAllArticles(): Promise<Article[]> {
  return [
    {
      id: 1,
      slug: "penerimaan-santri-baru-2025",
      title: "Penerimaan Santri Baru Tahun Ajaran 2025/2026",
      excerpt: "Pondok Pesantren K3 Arafah membuka pendaftaran santri baru...",
      content: "<p>Detail konten pendaftaran...</p>",
      image: "/images/article-psb.png",
      is_published: true,
      published_at: "2025-01-01T08:00:00Z",
      author_id: 1,
      created_at: "2024-12-25T00:00:00Z",
      updated_at: "2024-12-25T00:00:00Z",
      author: {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        name: "Admin",
        role: "admin",
      },
    },
    {
      id: 2,
      slug: "kegiatan-ramadhan-di-pesantren",
      title: "Semarak Kegiatan Ramadhan di Pesantren",
      excerpt: "Berbagai kegiatan positif mengisi bulan suci Ramadhan...",
      content: "<p>Detail kegiatan ramadhan...</p>",
      image: "/images/article-ramadhan.png",
      is_published: true,
      published_at: "2025-03-10T08:00:00Z",
      author_id: 2,
      created_at: "2025-03-01T00:00:00Z",
      updated_at: "2025-03-01T00:00:00Z",
      author: {
        id: 2,
        username: "ustadz_hanif",
        email: "hanif@example.com",
        name: "Ustadz Hanif",
        role: "editor",
      },
    },
    {
      id: 3,
      slug: "prestasi-santri-tingkat-provinsi",
      title: "Alhamdulillah, Santri K3 Arafah Raih Juara 1 MQK Provinsi",
      excerpt: "Selamat kepada Ananda Fulan bin Fulan atas prestasinya...",
      content: "<p>Detail prestasi...</p>",
      image: "/images/article-achievement.png",
      is_published: true,
      published_at: "2025-02-15T08:00:00Z",
      author_id: 1,
      created_at: "2025-02-10T00:00:00Z",
      updated_at: "2025-02-10T00:00:00Z",
      author: {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        name: "Admin",
        role: "admin",
      },
    },
    {
      id: 4,
      slug: "kunjungan-syeikh-mesir",
      title: "Kunjungan Syeikh dari Universitas Al-Azhar Mesir",
      excerpt: "Membangun kerjasama pendidikan internasional...",
      content: "<p>Detail kunjungan...</p>",
      image: "/images/article-visit.png",
      is_published: true,
      published_at: "2025-01-20T08:00:00Z",
      author_id: 3,
      created_at: "2025-01-15T00:00:00Z",
      updated_at: "2025-01-15T00:00:00Z",
      author: {
        id: 3,
        username: "humas",
        email: "humas@example.com",
        name: "Humas",
        role: "editor",
      },
    },
  ];
}
