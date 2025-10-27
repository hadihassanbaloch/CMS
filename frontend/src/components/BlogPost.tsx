import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface BlogPostProps {
  title: string;
  date: string;
  content: React.ReactNode;
  image: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, date, content, image }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/#blog')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Blog
        </button>

        <article>
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{title}</h1>
            <p className="text-gray-600">{date}</p>
          </div>

          <div className="aspect-w-16 aspect-h-9 mb-8">
            <img
              src={image}
              alt={title}
              className="rounded-lg object-cover w-full h-[400px]"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {content}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;