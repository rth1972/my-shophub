import Link from "next/link";
import React from "react";
import { House } from 'lucide-react';

interface BreadcrumbProps {
  title: string;
  pages: string[];
}

const Breadcrumb = ({ title, pages }:BreadcrumbProps) => {
  return (
    <div className="overflow-hidden shadow-breadcrumb">
      {/*<div className="border-t border-gray-3">*/}
      <div>
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/*<h1 className="font-semibold text-dark text-xl sm:text-2xl xl:text-custom-2">
              {title}
            </h1>*/}

            <ul className="flex items-center gap-2">
              <li className="text-custom-sm hover:text-blue">
                <Link className="text-blue flex items-center" href="/">
                    <House size={18} className="mr-1 text-custom-sm" />    
                    Home /
                </Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li className="text-custom-sm last:text-blue capitalize" key={key}>
                    {page} 
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
