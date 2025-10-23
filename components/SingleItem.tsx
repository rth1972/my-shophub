'use client'
import React from "react";
import Image from "next/image";
import Link from "next/link";

export type Category = {
  category_name: string;
  category_id: number;
  image: string;
};

const SingleItem = ({ item }: { item: Category }) => {
  return (
    <Link 
      href={`/category/${item.category_id}`}
      className="group flex flex-col items-center w-full"
    >
      <div className="max-w-[130px] w-full bg-[#F2F3F8] h-32.5 rounded-full flex items-center justify-center mb-4">
        <Image 
        alt={item.category_name || 'Category image'}
 
          src={`/images/categories/${item.image}`} 
          
          width={82} 
          height={62} 
        />
      </div>
      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-pink-600 to-pink-600 bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-pink-600">
          {item.category_name}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;