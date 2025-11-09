import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlogPost from '../../components/UserComponents/BlogPost';

const BariatricSurgeryPost = () => (
  <BlogPost
    title="Understanding Bariatric Surgery Options"
    date="March 15, 2024"
    image="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
    content={
      <>
        <p>
          Bariatric surgery has emerged as one of the most effective treatments for severe obesity and its related health conditions. As medical science advances, several surgical options have become available, each with its own benefits and considerations.
        </p>

        <h2>Types of Bariatric Surgery</h2>
        
        <h3>1. Gastric Sleeve (Sleeve Gastrectomy)</h3>
        <p>
          This procedure involves removing approximately 80% of the stomach, creating a smaller, sleeve-shaped stomach. This reduces food intake capacity and decreases hunger hormones, leading to significant weight loss.
        </p>

        <h3>2. Gastric Bypass (Roux-en-Y)</h3>
        <p>
          This procedure creates a small pouch from the stomach and connects it directly to the small intestine. This results in reduced food intake and decreased calorie absorption.
        </p>

        <h3>3. Mini Gastric Bypass</h3>
        <p>
          A simplified version of the traditional gastric bypass, this procedure offers similar benefits with potentially fewer complications and shorter operating time.
        </p>

        <h2>Benefits Beyond Weight Loss</h2>
        <ul>
          <li>Improvement or resolution of type 2 diabetes</li>
          <li>Reduced cardiovascular risk</li>
          <li>Improved joint health</li>
          <li>Enhanced quality of life</li>
          <li>Better mental health outcomes</li>
        </ul>

        <h2>Making the Right Choice</h2>
        <p>
          The choice of bariatric procedure depends on various factors, including:
        </p>
        <ul>
          <li>Current weight and BMI</li>
          <li>Presence of co-existing health conditions</li>
          <li>Previous surgical history</li>
          <li>Personal preferences and lifestyle</li>
        </ul>

        <p>
          Consultation with an experienced bariatric surgeon is essential to determine the most appropriate procedure for your specific situation.
        </p>
      </>
    }
  />
);

const PostSurgeryLifePost = () => (
  <BlogPost
    title="Life After Metabolic Surgery"
    date="March 1, 2024"
    image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
    content={
      <>
        <p>
          Successful long-term outcomes after metabolic surgery depend significantly on lifestyle changes and adherence to post-operative guidelines. Understanding what to expect and how to maintain your results is crucial for achieving optimal health benefits.
        </p>

        <h2>The First Year After Surgery</h2>
        
        <h3>Dietary Changes</h3>
        <p>
          The post-surgery diet progresses through several stages:
        </p>
        <ul>
          <li>Liquid diet (weeks 1-2)</li>
          <li>Pureed foods (weeks 3-4)</li>
          <li>Soft foods (weeks 5-8)</li>
          <li>Regular healthy diet (after week 8)</li>
        </ul>

        <h3>Physical Activity</h3>
        <p>
          Regular exercise becomes crucial for:
        </p>
        <ul>
          <li>Maintaining muscle mass</li>
          <li>Boosting metabolism</li>
          <li>Improving cardiovascular health</li>
          <li>Supporting mental well-being</li>
        </ul>

        <h2>Long-term Success Strategies</h2>
        <ul>
          <li>Regular nutritional monitoring</li>
          <li>Vitamin and mineral supplementation</li>
          <li>Regular exercise routine</li>
          <li>Support group participation</li>
          <li>Regular medical follow-up</li>
        </ul>

        <h2>Managing Expectations</h2>
        <p>
          Understanding that surgery is a tool, not a cure, is essential. Success requires commitment to lifestyle changes and regular medical follow-up.
        </p>
      </>
    }
  />
);

const LaparoscopicMythsPost = () => (
  <BlogPost
    title="Myths About Laparoscopic Surgery"
    date="February 15, 2024"
    image="https://images.unsplash.com/photo-1579684453377-48ec05c6b30a?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
    content={
      <>
        <p>
          Laparoscopic surgery has revolutionized modern surgical practice, yet many misconceptions persist about this minimally invasive approach. Let's address some common myths and provide accurate information.
        </p>

        <h2>Common Myths Debunked</h2>
        
        <h3>Myth 1: Laparoscopic Surgery is Not as Safe as Open Surgery</h3>
        <p>
          Reality: Laparoscopic procedures often have lower complication rates, less pain, and faster recovery compared to traditional open surgery.
        </p>

        <h3>Myth 2: Recovery Takes Longer</h3>
        <p>
          Reality: Most patients return to normal activities much faster after laparoscopic surgery compared to open procedures.
        </p>

        <h3>Myth 3: All Surgeries Can Be Done Laparoscopically</h3>
        <p>
          Reality: While many procedures can be performed laparoscopically, some conditions may require traditional open surgery based on various factors.
        </p>

        <h2>Benefits of Laparoscopic Surgery</h2>
        <ul>
          <li>Smaller incisions</li>
          <li>Less post-operative pain</li>
          <li>Shorter hospital stay</li>
          <li>Faster return to work</li>
          <li>Better cosmetic results</li>
        </ul>

        <h2>Making an Informed Decision</h2>
        <p>
          The choice between laparoscopic and open surgery should be made in consultation with your surgeon, considering your specific condition and circumstances.
        </p>
      </>
    }
  />
);

const BlogPages = () => {
  return (
    <Routes>
      <Route path="/bariatric-surgery-options" element={<BariatricSurgeryPost />} />
      <Route path="/life-after-surgery" element={<PostSurgeryLifePost />} />
      <Route path="/laparoscopic-myths" element={<LaparoscopicMythsPost />} />
    </Routes>
  );
};

export default BlogPages;