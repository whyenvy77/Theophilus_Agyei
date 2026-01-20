// src/components/SkillCard.jsx (Suggested implementation)
import React from 'react';
import { motion } from 'framer-motion';

const SkillCard = ({ skill, icon: Icon, level }) => {
  const percentage = parseInt(level.replace('%', ''), 10);
  
  // Variant for the skill bar animation
  const barVariants = {
    hidden: { width: 0 },
    visible: { 
      width: level, 
      transition: { 
        duration: 1.5, 
        ease: "easeInOut" 
      } 
    },
  };

  return (
    <motion.div 
      className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-lg hover:border-indigo-600 transition duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {Icon && <Icon className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0" />}
          <h4 className="text-lg font-semibold text-white">{skill}</h4>
        </div>
        <span className="text-indigo-400 font-bold">{level}</span>
      </div>
      
      {/* Animated Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-2.5">
        <motion.div
          variants={barVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-400"
        />
      </div>
    </motion.div>
  );
};

export default SkillCard;