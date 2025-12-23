import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t">
      <div className="container px-4 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Pondok Pesantren K3 Arafah</h3>
            <p className="text-muted-foreground mt-2 text-center text-sm md:text-left">
              Membangun Generasi Qur&apos;ani yang Berakhlak Mulia dan Berwawasan Global.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Tautan</h3>
            <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/psb" className="hover:underline">
                  Pendaftaran Santri Baru
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:underline">
                  Login Admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Kontak</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Jl. Pesantren No. 123, Kota Arafah
              <br />
              Email: info@k3arafah.com
              <br />
              Telp: (021) 1234567
            </p>
          </div>
        </div>
        <div className="text-disabled mt-8 border-t pt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} Yayasan K3 Arafah. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
