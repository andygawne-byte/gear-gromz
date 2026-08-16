// GROWTH MATCHER & SIZING FIT ENGINE FOR GEAR GROMZ

import { convertFootLength } from './sizingConverter.js';

export function calculateGearFit(item, grom) {
  if (!grom) return { fit: 'NONE', label: '' };

  const height = parseFloat(grom.current_height__in_) || 0;
  const weight = parseFloat(grom.current_weight__lbs_) || 0;
  const footInches = parseFloat(grom.foot_length__in_) || 0;
  
  const minH = parseFloat(item.min_height__in_) || 0;
  const maxH = parseFloat(item.max_height__in_) || 999;
  
  const minW = parseFloat(item.min_weight__lbs_) || 0;
  const maxW = parseFloat(item.max_weight__lbs_) || 999;

  let isHeightFit = false;
  let isSoonH = false;

  if (height > 0 && minH > 0) {
    if (height >= minH && height <= maxH) {
      isHeightFit = true;
    } else if (height < minH && (minH - height) <= 2.5) {
      // Within 2.5 inches of growing into it
      isSoonH = true;
    }
  }

  // Check Foot length / Ski Boot BSL match if item is footwear or skis
  let isFootwearMatch = false;
  if (footInches > 0 && (item.category === 'Boots/Footwear' || item.category === 'Ski/Snowboard')) {
    const footConv = convertFootLength(footInches);
    const itemMondo = parseFloat(item.size_label) || 0;
    const gromMondo = parseFloat(footConv.mondo) || 0;
    
    if (gromMondo > 0 && itemMondo > 0) {
      if (Math.abs(itemMondo - gromMondo) <= 1.0) {
        isFootwearMatch = true;
      }
    }
  }

  if (isHeightFit || isFootwearMatch) {
    return {
      fit: 'PERFECT_MATCH',
      label: `⭐ PERFECT MATCH for ${grom.child_name.split(' ')[0]}`
    };
  }

  if (isSoonH) {
    return {
      fit: 'SOON',
      label: `⏳ SOON (3 Mos) for ${grom.child_name.split(' ')[0]}`
    };
  }

  return { fit: 'NONE', label: '' };
}
