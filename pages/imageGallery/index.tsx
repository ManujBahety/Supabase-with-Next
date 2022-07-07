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
const SUPABASE_URL = "https://uqwnbwltdmeybomzgrwg.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd25id2x0ZG1leWJvbXpncndnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY1NzEwNDM5NSwiZXhwIjoxOTcyNjgwMzk1fQ.fNPm_Afp69eIDkVw3mqBon4Ii3Vdqa6JbDpwmmulUuk";
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function getStaticProps() {
  const { data } = await supabaseAdmin.from("images").select("*").order("id");
  return {
    props: {
      images: data,
    },
  };
}
async function deleteImage(id: number) {
  console.log("in delete", id);
  const { data, error } = await supabaseAdmin
    .from("images")
    .delete()
    .match({ id: id });
  console.log(data);
}

function combiner(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function imageGallery({ images }: { images: Image[] }) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let imageUrl = "";
    if (image) {
      const { data, error } = await supabaseAdmin.storage
        .from("mugs")
        .upload(`mug1.png`, image);

      if (error) {
        console.log(error);
      }
      if (data) {
        console.log("data.Key=", data.Key);
        setImageUrl(data.Key);
        imageUrl = data.Key;
      }
    }
    console.log("imageurl=", imageUrl);
    const { data, error } = await supabaseAdmin.from("images").upsert({
      id: 8,
      name: name,
      href: postUrl,
      username: userName,
      imageSrc: imageUrl,
    });
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log("Added");
    }
  };

  return (
    <>
      <div className="flex justify-center p-10 font-bold text-4xl">
        Images loaded from Supabase
      </div>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-6xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {images.map((image) => (
            <LoadImage key={image.id} images={image} />
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="mug">Choose Photo:</label>
          <input
            type="file"
            accept="image/jpeg image/png"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="username">User Name:</label>
          <input
            value={userName}
            type="text"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="postUrl">Post URL:</label>
          <input
            value={postUrl}
            type="text"
            onChange={(e) => setPostUrl(e.target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </>
  );
}

function LoadImage({ images }: { images: Image }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="flex flex-col">
      <a href={images.href} className="group">
        <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
          <Image
            alt=""
            src={images.imageSrc}
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
        <h3 className="mt-4 text-sm text-gray-700">{images.name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">
          {images.username}
        </p>
      </a>
      <button
        onClick={() => {
          deleteImage(images.id);
        }}
        className=" border-2 p-1 rounded-md border-gray-400"
      >
        Delete
      </button>
    </div>
  );
}
