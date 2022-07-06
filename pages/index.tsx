import Image from "next/image";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Image = {
  id: number;
  href: string;
  imageSrc: string;
  name: string;
  username: string;
};

export async function getStaticProps() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const { data } = await supabaseAdmin.from("images").select("*").order("id");
  return {
    props: {
      images: data,
    },
  };
}

function combiner(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Gallery({ images }: { images: Image[] }) {
  return (
    <>
      <div className="flex justify-center p-10 font-bold text-4xl">
        Images loaded from Supabase
      </div>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-6xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {images.map((image) => (
            <LoadImage key={image.id} image={image} />
          ))}
        </div>
      </div>
    </>
  );
}

function LoadImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <a href={image.href} className="group">
      <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt=""
          src={image.imageSrc}
          width={300}
          height={300}
          objectFit="cover"
          className={combiner(
            "duration-700 ease-in-out group-hover:opacity-75 max-w-md ",
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{image.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.username}</p>
    </a>
  );
}
