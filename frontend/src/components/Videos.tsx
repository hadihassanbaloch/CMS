import React from 'react';
import { Youtube } from 'lucide-react';

const Videos = () => {
  const videos = [
    {
      id: 'OWBGOwwtHns',
      title: 'Bariatric Surgery Success Story',
      description: 'Patient testimonial about their weight loss journey'
    },
    {
      id: '4M3GluV6uHI',
      title: 'Understanding Weight Loss Surgery',
      description: 'Educational video about bariatric surgery options'
    },
    {
      id: 'DO7RKXPifx4',
      title: 'Life After Bariatric Surgery',
      description: 'Post-surgery guidance and lifestyle changes'
    }
  ];

  return (
    <section id="videos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Video Resources
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Educational videos and patient success stories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{video.title}</h3>
                <p className="text-gray-600">{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://www.youtube.com/@BestObesityCenterPakistanLahor/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <Youtube className="h-5 w-5 mr-2" />
            View More Videos on YouTube
          </a>
        </div>
      </div>
    </section>
  );
};

export default Videos;