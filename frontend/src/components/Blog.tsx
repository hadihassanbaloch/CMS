import React from 'react';
import { ScrollText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const posts = [
    {
      title: "Understanding Bariatric Surgery Options",
      excerpt: "A comprehensive guide to different weight loss surgery procedures and their benefits.",
      date: "March 15, 2024",
      image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
      slug: "bariatric-surgery-options"
    },
    {
      title: "Life After Metabolic Surgery",
      excerpt: "What to expect and how to maintain long-term success after your procedure.",
      date: "March 1, 2024",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
      slug: "life-after-surgery"
    },
    {
      title: "Myths About Laparoscopic Surgery",
      excerpt: "Debunking common misconceptions about minimally invasive surgical procedures.",
      date: "February 15, 2024",
      image: "https://images.unsplash.com/photo-1579684453377-48ec05c6b30a?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
      slug: "laparoscopic-myths"
    }
  ];

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Latest Blog Posts
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Educational content about surgical procedures and health
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <ScrollText className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  Read more
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;