// File: js/tests-list.js
// This file contains all tests for the homepage cards.
// Test Types: "shiftwise", "full", "chapterwise"

const ALL_TESTS = [

    // ============================================
    // SSC CGL - SHIFTWISE SUBJECT TESTS
    // ============================================
    
    // --- CGL Maths Shiftwise Tests ---
    { id: "cgl_shift_maths_12sep_s1", date: "12 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_12sep_s2", date: "12 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_12sep_s3", date: "12 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_13sep_s1", date: "13 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_13sep_s2", date: "13 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_13sep_s3", date: "13 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_14sep_s1", date: "14 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_14sep_s2", date: "14 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_14sep_s3", date: "14 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_15sep_s1", date: "15 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_15sep_s2", date: "15 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_15sep_s3", date: "15 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_16sep_s1", date: "16 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_16sep_s2", date: "16 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_16sep_s3", date: "16 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_17sep_s1", date: "17 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_17sep_s2", date: "17 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_17sep_s3", date: "17 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_18sep_s1", date: "18 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_18sep_s2", date: "18 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_18sep_s3", date: "18 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_19sep_s1", date: "19 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_19sep_s2", date: "19 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_19sep_s3", date: "19 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_20sep_s1", date: "20 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_20sep_s2", date: "20 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_20sep_s3", date: "20 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_21sep_s1", date: "21 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_21sep_s2", date: "21 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_21sep_s3", date: "21 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_22sep_s1", date: "22 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_22sep_s2", date: "22 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_22sep_s3", date: "22 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_23sep_s1", date: "23 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_23sep_s2", date: "23 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_23sep_s3", date: "23 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_24sep_s1", date: "24 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_24sep_s2", date: "24 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_24sep_s3", date: "24 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_25sep_s1", date: "25 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_25sep_s2", date: "25 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_25sep_s3", date: "25 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_26sep_s1", date: "26 Sep", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_26sep_s2", date: "26 Sep", title: "Shift 2", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_26sep_s3", date: "26 Sep", title: "Shift 3", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_maths_14oct_s1", date: "14 Oct", title: "Shift 1", subject: "Maths", exam: "CGL", testType: "shiftwise", isNew: true },

    // --- CGL Reasoning Shiftwise Tests ---
    { id: "cgl_shift_reasoning_12sep_s1", date: "12 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_12sep_s2", date: "12 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_12sep_s3", date: "12 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_13sep_s1", date: "13 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_13sep_s2", date: "13 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_13sep_s3", date: "13 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_14sep_s1", date: "14 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_14sep_s2", date: "14 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_14sep_s3", date: "14 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_15sep_s1", date: "15 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_15sep_s2", date: "15 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_15sep_s3", date: "15 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_16sep_s1", date: "16 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_16sep_s2", date: "16 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_16sep_s3", date: "16 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_17sep_s1", date: "17 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_17sep_s2", date: "17 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_17sep_s3", date: "17 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_18sep_s1", date: "18 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_18sep_s2", date: "18 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_18sep_s3", date: "18 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_19sep_s1", date: "19 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_19sep_s2", date: "19 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_19sep_s3", date: "19 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_20sep_s1", date: "20 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_20sep_s2", date: "20 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_20sep_s3", date: "20 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_21sep_s1", date: "21 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_21sep_s2", date: "21 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_21sep_s3", date: "21 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_22sep_s1", date: "22 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_22sep_s2", date: "22 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_22sep_s3", date: "22 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_23sep_s1", date: "23 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_23sep_s2", date: "23 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_23sep_s3", date: "23 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_24sep_s1", date: "24 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_24sep_s2", date: "24 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_24sep_s3", date: "24 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_25sep_s1", date: "25 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_25sep_s2", date: "25 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_25sep_s3", date: "25 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_26sep_s1", date: "26 Sep", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_26sep_s2", date: "26 Sep", title: "Shift 2", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_26sep_s3", date: "26 Sep", title: "Shift 3", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_reasoning_14oct_s1", date: "14 Oct", title: "Shift 1", subject: "Reasoning", exam: "CGL", testType: "shiftwise", isNew: true },
    // ========== CGL ENGLISH SHIFTWISE ==========
    
    // 12 Sep
    { id: "cgl_shift_english_12sep_s1", date: "12 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_12sep_s2", date: "12 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_12sep_s3", date: "12 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 13 Sep
    { id: "cgl_shift_english_13sep_s1", date: "13 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_13sep_s2", date: "13 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_13sep_s3", date: "13 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 14 Sep
    { id: "cgl_shift_english_14sep_s1", date: "14 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_14sep_s2", date: "14 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_14sep_s3", date: "14 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 15 Sep
    { id: "cgl_shift_english_15sep_s1", date: "15 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_15sep_s2", date: "15 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_15sep_s3", date: "15 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 16 Sep
    { id: "cgl_shift_english_16sep_s1", date: "16 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_16sep_s2", date: "16 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_16sep_s3", date: "16 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 17 Sep
    { id: "cgl_shift_english_17sep_s1", date: "17 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_17sep_s2", date: "17 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_17sep_s3", date: "17 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 18 Sep
    { id: "cgl_shift_english_18sep_s1", date: "18 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_18sep_s2", date: "18 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_18sep_s3", date: "18 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 19 Sep
    { id: "cgl_shift_english_19sep_s1", date: "19 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_19sep_s2", date: "19 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_19sep_s3", date: "19 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 20 Sep
    { id: "cgl_shift_english_20sep_s1", date: "20 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_20sep_s2", date: "20 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_20sep_s3", date: "20 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 21 Sep
    { id: "cgl_shift_english_21sep_s1", date: "21 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_21sep_s2", date: "21 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_21sep_s3", date: "21 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 22 Sep
    { id: "cgl_shift_english_22sep_s1", date: "22 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_22sep_s2", date: "22 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_22sep_s3", date: "22 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 23 Sep
    { id: "cgl_shift_english_23sep_s1", date: "23 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_23sep_s2", date: "23 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_23sep_s3", date: "23 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 24 Sep
    { id: "cgl_shift_english_24sep_s1", date: "24 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_24sep_s2", date: "24 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_24sep_s3", date: "24 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 25 Sep
    { id: "cgl_shift_english_25sep_s1", date: "25 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_25sep_s2", date: "25 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_25sep_s3", date: "25 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 26 Sep
    { id: "cgl_shift_english_26sep_s1", date: "26 Sep", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_26sep_s2", date: "26 Sep", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_26sep_s3", date: "26 Sep", title: "Shift 3", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 14 Oct (Only Shift 1 & 2)
    { id: "cgl_shift_english_14oct_s1", date: "14 Oct", title: "Shift 1", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_english_14oct_s2", date: "14 Oct", title: "Shift 2", subject: "English", exam: "CGL", testType: "shiftwise", isNew: true },

    // ========== CGL GK SHIFTWISE ==========
    
    // 12 Sep
    { id: "cgl_shift_gk_12sep_s1", date: "12 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_12sep_s2", date: "12 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_12sep_s3", date: "12 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 13 Sep
    { id: "cgl_shift_gk_13sep_s1", date: "13 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_13sep_s2", date: "13 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_13sep_s3", date: "13 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 14 Sep
    { id: "cgl_shift_gk_14sep_s1", date: "14 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_14sep_s2", date: "14 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_14sep_s3", date: "14 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 15 Sep
    { id: "cgl_shift_gk_15sep_s1", date: "15 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_15sep_s2", date: "15 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_15sep_s3", date: "15 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 16 Sep
    { id: "cgl_shift_gk_16sep_s1", date: "16 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_16sep_s2", date: "16 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_16sep_s3", date: "16 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 17 Sep
    { id: "cgl_shift_gk_17sep_s1", date: "17 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_17sep_s2", date: "17 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_17sep_s3", date: "17 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 18 Sep
    { id: "cgl_shift_gk_18sep_s1", date: "18 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_18sep_s2", date: "18 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_18sep_s3", date: "18 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 19 Sep
    { id: "cgl_shift_gk_19sep_s1", date: "19 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_19sep_s2", date: "19 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_19sep_s3", date: "19 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 20 Sep
    { id: "cgl_shift_gk_20sep_s1", date: "20 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_20sep_s2", date: "20 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_20sep_s3", date: "20 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 21 Sep
    { id: "cgl_shift_gk_21sep_s1", date: "21 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_21sep_s2", date: "21 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_21sep_s3", date: "21 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 22 Sep
    { id: "cgl_shift_gk_22sep_s1", date: "22 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_22sep_s2", date: "22 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_22sep_s3", date: "22 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 23 Sep
    { id: "cgl_shift_gk_23sep_s1", date: "23 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_23sep_s2", date: "23 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_23sep_s3", date: "23 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 24 Sep
    { id: "cgl_shift_gk_24sep_s1", date: "24 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_24sep_s2", date: "24 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_24sep_s3", date: "24 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 25 Sep
    { id: "cgl_shift_gk_25sep_s1", date: "25 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_25sep_s2", date: "25 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_25sep_s3", date: "25 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 26 Sep
    { id: "cgl_shift_gk_26sep_s1", date: "26 Sep", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_26sep_s2", date: "26 Sep", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_26sep_s3", date: "26 Sep", title: "Shift 3", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    
    // 14 Oct (Only Shift 1 & 2)
    { id: "cgl_shift_gk_14oct_s1", date: "14 Oct", title: "Shift 1", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },
    { id: "cgl_shift_gk_14oct_s2", date: "14 Oct", title: "Shift 2", subject: "GK", exam: "CGL", testType: "shiftwise", isNew: true },

    // ============================================
    // SSC CGL - FULL MOCK TESTS
    // ============================================
    {
        id: "cgl_full_001",
        title: "Full Mock Test 01",
        date: "2024",
        exam: "CGL",
        testType: "full",
        questions: 100,
        time: 60,
        sections: ["Maths", "Reasoning", "English", "GK"],
        isNew: true,
        isPremium: false
    },
    {
        id: "cgl_full_002",
        title: "Full Mock Test 02",
        date: "2024",
        exam: "CGL",
        testType: "full",
        questions: 100,
        time: 60,
        sections: ["Maths", "Reasoning", "English", "GK"],
        isNew: true,
        isPremium: false
    },
    {
        id: "cgl_full_003",
        title: "Full Mock Test 03",
        date: "2024",
        exam: "CGL",
        testType: "full",
        questions: 100,
        time: 60,
        sections: ["Maths", "Reasoning", "English", "GK"],
        isNew: false,
        isPremium: true
    },

    // ============================================
    // SSC CGL - CHAPTERWISE TESTS
    // ============================================
    
    // --- CGL Maths Chapterwise ---
    { id: "cgl_chapter_maths_percentage_001", title: "Percentage Test 01", subject: "Maths", chapter: "percentage", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_maths_percentage_002", title: "Percentage Test 02", subject: "Maths", chapter: "percentage", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "medium", isNew: true },
    { id: "cgl_chapter_maths_percentage_003", title: "Percentage Test 03", subject: "Maths", chapter: "percentage", exam: "CGL", testType: "chapterwise", questions: 25, time: 20, difficulty: "hard", isNew: false },
    
    { id: "cgl_chapter_maths_profitloss_001", title: "Profit & Loss Test 01", subject: "Maths", chapter: "profitLoss", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_maths_profitloss_002", title: "Profit & Loss Test 02", subject: "Maths", chapter: "profitLoss", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "medium", isNew: false },
    
    { id: "cgl_chapter_maths_sici_001", title: "SI & CI Test 01", subject: "Maths", chapter: "siCi", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_maths_sici_002", title: "SI & CI Test 02", subject: "Maths", chapter: "siCi", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "medium", isNew: false },
    
    { id: "cgl_chapter_maths_ratio_001", title: "Ratio & Proportion Test 01", subject: "Maths", chapter: "ratio", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_maths_timework_001", title: "Time & Work Test 01", subject: "Maths", chapter: "timeWork", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_maths_timework_002", title: "Time & Work Test 02", subject: "Maths", chapter: "timeWork", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "medium", isNew: false },
    
    { id: "cgl_chapter_maths_timedist_001", title: "Time & Distance Test 01", subject: "Maths", chapter: "timeDistance", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_maths_number_001", title: "Number System Test 01", subject: "Maths", chapter: "numberSystem", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_maths_number_002", title: "Number System Test 02", subject: "Maths", chapter: "numberSystem", exam: "CGL", testType: "chapterwise", questions: 25, time: 18, difficulty: "medium", isNew: false },
    
    { id: "cgl_chapter_maths_algebra_001", title: "Algebra Test 01", subject: "Maths", chapter: "algebra", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_maths_algebra_002", title: "Algebra Test 02", subject: "Maths", chapter: "algebra", exam: "CGL", testType: "chapterwise", questions: 25, time: 20, difficulty: "hard", isNew: false },
    
    { id: "cgl_chapter_maths_geometry_001", title: "Geometry Test 01", subject: "Maths", chapter: "geometry", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_maths_geometry_002", title: "Geometry Test 02", subject: "Maths", chapter: "geometry", exam: "CGL", testType: "chapterwise", questions: 25, time: 20, difficulty: "medium", isNew: false },
    
    { id: "cgl_chapter_maths_trigo_001", title: "Trigonometry Test 01", subject: "Maths", chapter: "trigonometry", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_maths_mensuration_001", title: "Mensuration Test 01", subject: "Maths", chapter: "mensuration", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_maths_di_001", title: "Data Interpretation Test 01", subject: "Maths", chapter: "dataInterpretation", exam: "CGL", testType: "chapterwise", questions: 20, time: 18, difficulty: "easy", isNew: true },

    // --- CGL Reasoning Chapterwise ---
    { id: "cgl_chapter_reasoning_analogy_001", title: "Analogy Test 01", subject: "Reasoning", chapter: "analogy", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_reasoning_analogy_002", title: "Analogy Test 02", subject: "Reasoning", chapter: "analogy", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "medium", isNew: false },
    
    { id: "cgl_chapter_reasoning_classification_001", title: "Classification Test 01", subject: "Reasoning", chapter: "classification", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_reasoning_series_001", title: "Series Test 01", subject: "Reasoning", chapter: "series", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_reasoning_series_002", title: "Series Test 02", subject: "Reasoning", chapter: "series", exam: "CGL", testType: "chapterwise", questions: 25, time: 15, difficulty: "medium", isNew: false },
    
    { id: "cgl_chapter_reasoning_coding_001", title: "Coding-Decoding Test 01", subject: "Reasoning", chapter: "codingDecoding", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_reasoning_blood_001", title: "Blood Relation Test 01", subject: "Reasoning", chapter: "bloodRelation", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_reasoning_direction_001", title: "Direction Test 01", subject: "Reasoning", chapter: "direction", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_reasoning_syllogism_001", title: "Syllogism Test 01", subject: "Reasoning", chapter: "syllogism", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_reasoning_puzzle_001", title: "Puzzle Test 01", subject: "Reasoning", chapter: "puzzle", exam: "CGL", testType: "chapterwise", questions: 15, time: 15, difficulty: "medium", isNew: true },
    
    { id: "cgl_chapter_reasoning_venn_001", title: "Venn Diagram Test 01", subject: "Reasoning", chapter: "vennDiagram", exam: "CGL", testType: "chapterwise", questions: 20, time: 10, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_reasoning_mirror_001", title: "Mirror & Water Image Test 01", subject: "Reasoning", chapter: "mirrorImage", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_reasoning_paper_001", title: "Paper Folding Test 01", subject: "Reasoning", chapter: "paperFolding", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    
    { id: "cgl_chapter_reasoning_dice_001", title: "Dice & Cube Test 01", subject: "Reasoning", chapter: "diceCube", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },

    // --- CGL English Chapterwise ---
    { id: "cgl_chapter_english_vocab_001", title: "Vocabulary Test 01", subject: "English", chapter: "vocabulary", exam: "CGL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_english_synonyms_001", title: "Synonyms Test 01", subject: "English", chapter: "synonyms", exam: "CGL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_english_antonyms_001", title: "Antonyms Test 01", subject: "English", chapter: "antonyms", exam: "CGL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_english_idioms_001", title: "Idioms & Phrases Test 01", subject: "English", chapter: "idiomsPhrases", exam: "CGL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_english_oneword_001", title: "One Word Substitution Test 01", subject: "English", chapter: "oneWord", exam: "CGL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_english_error_001", title: "Error Spotting Test 01", subject: "English", chapter: "errorSpotting", exam: "CGL", testType: "chapterwise", questions: 25, time: 12, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_english_fill_001", title: "Fill in the Blanks Test 01", subject: "English", chapter: "fillBlanks", exam: "CGL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_english_cloze_001", title: "Cloze Test 01", subject: "English", chapter: "clozeTest", exam: "CGL", testType: "chapterwise", questions: 20, time: 12, difficulty: "medium", isNew: true },
    { id: "cgl_chapter_english_rc_001", title: "Reading Comprehension Test 01", subject: "English", chapter: "readingComprehension", exam: "CGL", testType: "chapterwise", questions: 20, time: 15, difficulty: "medium", isNew: true },
    { id: "cgl_chapter_english_sentence_001", title: "Sentence Improvement Test 01", subject: "English", chapter: "sentenceImprovement", exam: "CGL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_english_voice_001", title: "Active-Passive Voice Test 01", subject: "English", chapter: "activePassive", exam: "CGL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_english_speech_001", title: "Direct-Indirect Speech Test 01", subject: "English", chapter: "directIndirect", exam: "CGL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },

    // --- CGL GK Chapterwise ---
    { id: "cgl_chapter_gk_history_001", title: "History Test 01", subject: "GK", chapter: "history", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_gk_history_002", title: "History Test 02", subject: "GK", chapter: "history", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "medium", isNew: false },
    { id: "cgl_chapter_gk_geography_001", title: "Geography Test 01", subject: "GK", chapter: "geography", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_gk_polity_001", title: "Polity Test 01", subject: "GK", chapter: "polity", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_gk_economy_001", title: "Economy Test 01", subject: "GK", chapter: "economy", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_gk_science_001", title: "General Science Test 01", subject: "GK", chapter: "generalScience", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_gk_physics_001", title: "Physics Test 01", subject: "GK", chapter: "physics", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_gk_chemistry_001", title: "Chemistry Test 01", subject: "GK", chapter: "chemistry", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_gk_biology_001", title: "Biology Test 01", subject: "GK", chapter: "biology", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_gk_current_001", title: "Current Affairs Jan 2025", subject: "GK", chapter: "currentAffairs", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_gk_static_001", title: "Static GK Test 01", subject: "GK", chapter: "staticGK", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "cgl_chapter_gk_computer_001", title: "Computer Knowledge Test 01", subject: "GK", chapter: "computer", exam: "CGL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },

    // ============================================
       // ============================================
    // SSC CHSL - SHIFTWISE SUBJECT TESTS
    // (12 Nov - 30 Nov 2024)
    // ============================================

    // ========== CHSL MATHS SHIFTWISE ==========
    
    // 12 Nov
    { id: "chsl_shift_maths_12nov_s1", date: "12 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_12nov_s2", date: "12 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_12nov_s3", date: "12 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 13 Nov
    { id: "chsl_shift_maths_13nov_s1", date: "13 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_13nov_s2", date: "13 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_13nov_s3", date: "13 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 14 Nov
    { id: "chsl_shift_maths_14nov_s1", date: "14 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_14nov_s2", date: "14 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_14nov_s3", date: "14 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 15 Nov
    { id: "chsl_shift_maths_15nov_s1", date: "15 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_15nov_s2", date: "15 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_15nov_s3", date: "15 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 16 Nov
    { id: "chsl_shift_maths_16nov_s1", date: "16 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_16nov_s2", date: "16 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_16nov_s3", date: "16 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 17 Nov
    { id: "chsl_shift_maths_17nov_s1", date: "17 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_17nov_s2", date: "17 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_17nov_s3", date: "17 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 18 Nov
    { id: "chsl_shift_maths_18nov_s1", date: "18 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_18nov_s2", date: "18 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_18nov_s3", date: "18 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 19 Nov
    { id: "chsl_shift_maths_19nov_s1", date: "19 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_19nov_s2", date: "19 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_19nov_s3", date: "19 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 20 Nov
    { id: "chsl_shift_maths_20nov_s1", date: "20 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_20nov_s2", date: "20 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_20nov_s3", date: "20 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 21 Nov
    { id: "chsl_shift_maths_21nov_s1", date: "21 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_21nov_s2", date: "21 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_21nov_s3", date: "21 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 22 Nov
    { id: "chsl_shift_maths_22nov_s1", date: "22 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_22nov_s2", date: "22 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_22nov_s3", date: "22 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 23 Nov
    { id: "chsl_shift_maths_23nov_s1", date: "23 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_23nov_s2", date: "23 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_23nov_s3", date: "23 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 24 Nov
    { id: "chsl_shift_maths_24nov_s1", date: "24 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_24nov_s2", date: "24 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_24nov_s3", date: "24 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 25 Nov
    { id: "chsl_shift_maths_25nov_s1", date: "25 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_25nov_s2", date: "25 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_25nov_s3", date: "25 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 26 Nov
    { id: "chsl_shift_maths_26nov_s1", date: "26 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_26nov_s2", date: "26 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_26nov_s3", date: "26 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 27 Nov
    { id: "chsl_shift_maths_27nov_s1", date: "27 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_27nov_s2", date: "27 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_27nov_s3", date: "27 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 28 Nov
    { id: "chsl_shift_maths_28nov_s1", date: "28 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_28nov_s2", date: "28 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_28nov_s3", date: "28 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 29 Nov
    { id: "chsl_shift_maths_29nov_s1", date: "29 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_29nov_s2", date: "29 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_29nov_s3", date: "29 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 30 Nov
    { id: "chsl_shift_maths_30nov_s1", date: "30 Nov", title: "Shift 1", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_30nov_s2", date: "30 Nov", title: "Shift 2", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_maths_30nov_s3", date: "30 Nov", title: "Shift 3", subject: "Maths", exam: "CHSL", testType: "shiftwise", isNew: true },

    // ========== CHSL REASONING SHIFTWISE ==========
    
    // 12 Nov
    { id: "chsl_shift_reasoning_12nov_s1", date: "12 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_12nov_s2", date: "12 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_12nov_s3", date: "12 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 13 Nov
    { id: "chsl_shift_reasoning_13nov_s1", date: "13 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_13nov_s2", date: "13 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_13nov_s3", date: "13 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 14 Nov
    { id: "chsl_shift_reasoning_14nov_s1", date: "14 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_14nov_s2", date: "14 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_14nov_s3", date: "14 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 15 Nov
    { id: "chsl_shift_reasoning_15nov_s1", date: "15 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_15nov_s2", date: "15 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_15nov_s3", date: "15 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 16 Nov
    { id: "chsl_shift_reasoning_16nov_s1", date: "16 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_16nov_s2", date: "16 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_16nov_s3", date: "16 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 17 Nov
    { id: "chsl_shift_reasoning_17nov_s1", date: "17 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_17nov_s2", date: "17 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_17nov_s3", date: "17 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 18 Nov
    { id: "chsl_shift_reasoning_18nov_s1", date: "18 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_18nov_s2", date: "18 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_18nov_s3", date: "18 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 19 Nov
    { id: "chsl_shift_reasoning_19nov_s1", date: "19 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_19nov_s2", date: "19 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_19nov_s3", date: "19 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 20 Nov
    { id: "chsl_shift_reasoning_20nov_s1", date: "20 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_20nov_s2", date: "20 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_20nov_s3", date: "20 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 21 Nov
    { id: "chsl_shift_reasoning_21nov_s1", date: "21 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_21nov_s2", date: "21 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_21nov_s3", date: "21 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 22 Nov
    { id: "chsl_shift_reasoning_22nov_s1", date: "22 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_22nov_s2", date: "22 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_22nov_s3", date: "22 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 23 Nov
    { id: "chsl_shift_reasoning_23nov_s1", date: "23 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_23nov_s2", date: "23 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_23nov_s3", date: "23 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 24 Nov
    { id: "chsl_shift_reasoning_24nov_s1", date: "24 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_24nov_s2", date: "24 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_24nov_s3", date: "24 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 25 Nov
    { id: "chsl_shift_reasoning_25nov_s1", date: "25 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_25nov_s2", date: "25 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_25nov_s3", date: "25 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 26 Nov
    { id: "chsl_shift_reasoning_26nov_s1", date: "26 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_26nov_s2", date: "26 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_26nov_s3", date: "26 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 27 Nov
    { id: "chsl_shift_reasoning_27nov_s1", date: "27 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_27nov_s2", date: "27 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_27nov_s3", date: "27 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 28 Nov
    { id: "chsl_shift_reasoning_28nov_s1", date: "28 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_28nov_s2", date: "28 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_28nov_s3", date: "28 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 29 Nov
    { id: "chsl_shift_reasoning_29nov_s1", date: "29 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_29nov_s2", date: "29 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_29nov_s3", date: "29 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 30 Nov
    { id: "chsl_shift_reasoning_30nov_s1", date: "30 Nov", title: "Shift 1", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_30nov_s2", date: "30 Nov", title: "Shift 2", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_reasoning_30nov_s3", date: "30 Nov", title: "Shift 3", subject: "Reasoning", exam: "CHSL", testType: "shiftwise", isNew: true },

    // ========== CHSL ENGLISH SHIFTWISE ==========
    
    // 12 Nov
    { id: "chsl_shift_english_12nov_s1", date: "12 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_12nov_s2", date: "12 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_12nov_s3", date: "12 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 13 Nov
    { id: "chsl_shift_english_13nov_s1", date: "13 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_13nov_s2", date: "13 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_13nov_s3", date: "13 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 14 Nov
    { id: "chsl_shift_english_14nov_s1", date: "14 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_14nov_s2", date: "14 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_14nov_s3", date: "14 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 15 Nov
    { id: "chsl_shift_english_15nov_s1", date: "15 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_15nov_s2", date: "15 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_15nov_s3", date: "15 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 16 Nov
    { id: "chsl_shift_english_16nov_s1", date: "16 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_16nov_s2", date: "16 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_16nov_s3", date: "16 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 17 Nov
    { id: "chsl_shift_english_17nov_s1", date: "17 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_17nov_s2", date: "17 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_17nov_s3", date: "17 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 18 Nov
    { id: "chsl_shift_english_18nov_s1", date: "18 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_18nov_s2", date: "18 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_18nov_s3", date: "18 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 19 Nov
    { id: "chsl_shift_english_19nov_s1", date: "19 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_19nov_s2", date: "19 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_19nov_s3", date: "19 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 20 Nov
    { id: "chsl_shift_english_20nov_s1", date: "20 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_20nov_s2", date: "20 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_20nov_s3", date: "20 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 21 Nov
    { id: "chsl_shift_english_21nov_s1", date: "21 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_21nov_s2", date: "21 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_21nov_s3", date: "21 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 22 Nov
    { id: "chsl_shift_english_22nov_s1", date: "22 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_22nov_s2", date: "22 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_22nov_s3", date: "22 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 23 Nov
    { id: "chsl_shift_english_23nov_s1", date: "23 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_23nov_s2", date: "23 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_23nov_s3", date: "23 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 24 Nov
    { id: "chsl_shift_english_24nov_s1", date: "24 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_24nov_s2", date: "24 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_24nov_s3", date: "24 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 25 Nov
    { id: "chsl_shift_english_25nov_s1", date: "25 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_25nov_s2", date: "25 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_25nov_s3", date: "25 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 26 Nov
    { id: "chsl_shift_english_26nov_s1", date: "26 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_26nov_s2", date: "26 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_26nov_s3", date: "26 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 27 Nov
    { id: "chsl_shift_english_27nov_s1", date: "27 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_27nov_s2", date: "27 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_27nov_s3", date: "27 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 28 Nov
    { id: "chsl_shift_english_28nov_s1", date: "28 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_28nov_s2", date: "28 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_28nov_s3", date: "28 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 29 Nov
    { id: "chsl_shift_english_29nov_s1", date: "29 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_29nov_s2", date: "29 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_29nov_s3", date: "29 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 30 Nov
    { id: "chsl_shift_english_30nov_s1", date: "30 Nov", title: "Shift 1", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_30nov_s2", date: "30 Nov", title: "Shift 2", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_english_30nov_s3", date: "30 Nov", title: "Shift 3", subject: "English", exam: "CHSL", testType: "shiftwise", isNew: true },

    // ========== CHSL GK SHIFTWISE ==========
    
    // 12 Nov
    { id: "chsl_shift_gk_12nov_s1", date: "12 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_12nov_s2", date: "12 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_12nov_s3", date: "12 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 13 Nov
    { id: "chsl_shift_gk_13nov_s1", date: "13 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_13nov_s2", date: "13 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_13nov_s3", date: "13 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 14 Nov
    { id: "chsl_shift_gk_14nov_s1", date: "14 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_14nov_s2", date: "14 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_14nov_s3", date: "14 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 15 Nov
    { id: "chsl_shift_gk_15nov_s1", date: "15 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_15nov_s2", date: "15 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_15nov_s3", date: "15 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 16 Nov
    { id: "chsl_shift_gk_16nov_s1", date: "16 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_16nov_s2", date: "16 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_16nov_s3", date: "16 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 17 Nov
    { id: "chsl_shift_gk_17nov_s1", date: "17 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_17nov_s2", date: "17 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_17nov_s3", date: "17 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 18 Nov
    { id: "chsl_shift_gk_18nov_s1", date: "18 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_18nov_s2", date: "18 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_18nov_s3", date: "18 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 19 Nov
    { id: "chsl_shift_gk_19nov_s1", date: "19 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_19nov_s2", date: "19 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_19nov_s3", date: "19 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 20 Nov
    { id: "chsl_shift_gk_20nov_s1", date: "20 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_20nov_s2", date: "20 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_20nov_s3", date: "20 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 21 Nov
    { id: "chsl_shift_gk_21nov_s1", date: "21 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_21nov_s2", date: "21 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_21nov_s3", date: "21 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 22 Nov
    { id: "chsl_shift_gk_22nov_s1", date: "22 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_22nov_s2", date: "22 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_22nov_s3", date: "22 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 23 Nov
    { id: "chsl_shift_gk_23nov_s1", date: "23 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_23nov_s2", date: "23 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_23nov_s3", date: "23 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 24 Nov
    { id: "chsl_shift_gk_24nov_s1", date: "24 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_24nov_s2", date: "24 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_24nov_s3", date: "24 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 25 Nov
    { id: "chsl_shift_gk_25nov_s1", date: "25 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_25nov_s2", date: "25 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_25nov_s3", date: "25 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 26 Nov
    { id: "chsl_shift_gk_26nov_s1", date: "26 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_26nov_s2", date: "26 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_26nov_s3", date: "26 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 27 Nov
    { id: "chsl_shift_gk_27nov_s1", date: "27 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_27nov_s2", date: "27 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_27nov_s3", date: "27 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 28 Nov
    { id: "chsl_shift_gk_28nov_s1", date: "28 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_28nov_s2", date: "28 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_28nov_s3", date: "28 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 29 Nov
    { id: "chsl_shift_gk_29nov_s1", date: "29 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_29nov_s2", date: "29 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_29nov_s3", date: "29 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    
    // 30 Nov
    { id: "chsl_shift_gk_30nov_s1", date: "30 Nov", title: "Shift 1", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_30nov_s2", date: "30 Nov", title: "Shift 2", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },
    { id: "chsl_shift_gk_30nov_s3", date: "30 Nov", title: "Shift 3", subject: "GK", exam: "CHSL", testType: "shiftwise", isNew: true },

    // ============================================
    // SSC CHSL - FULL MOCK TESTS
    // ============================================
    {
        id: "chsl_full_001",
        title: "Full Mock Test 01",
        date: "2024",
        exam: "CHSL",
        testType: "full",
        questions: 100,
        time: 60,
        sections: ["Maths", "Reasoning", "English", "GK"],
        isNew: true,
        isPremium: false
    },
    {
        id: "chsl_full_002",
        title: "Full Mock Test 02",
        date: "2024",
        exam: "CHSL",
        testType: "full",
        questions: 100,
        time: 60,
        sections: ["Maths", "Reasoning", "English", "GK"],
        isNew: true,
        isPremium: false
    },
    {
        id: "chsl_full_003",
        title: "Full Mock Test 03",
        date: "2024",
        exam: "CHSL",
        testType: "full",
        questions: 100,
        time: 60,
        sections: ["Maths", "Reasoning", "English", "GK"],
        isNew: false,
        isPremium: true
    },

    // ============================================
    // SSC CHSL - TOP 100 MATHS (Special)
    // ============================================
    {
        id: "chsl_top100_maths_001",
        title: "Top 100 Maths - Set 1",
        exam: "CHSL",
        testType: "top100",
        subject: "Top100Maths",
        questions: 50,
        time: 60,
        isNew: true
    },
    {
        id: "chsl_top100_maths_002",
        title: "Top 100 Maths - Set 2",
        exam: "CHSL",
        testType: "top100",
        subject: "Top100Maths",
        questions: 50,
        time: 60,
        isNew: true
    },

    // ============================================
    // SSC CHSL - CHAPTERWISE TESTS
    // ============================================
    
    // --- CHSL Maths Chapterwise ---
    { id: "chsl_chapter_maths_percentage_001", title: "Percentage Test 01", subject: "Maths", chapter: "percentage", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_maths_percentage_002", title: "Percentage Test 02", subject: "Maths", chapter: "percentage", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "medium", isNew: false },
    { id: "chsl_chapter_maths_profitloss_001", title: "Profit & Loss Test 01", subject: "Maths", chapter: "profitLoss", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_maths_sici_001", title: "SI & CI Test 01", subject: "Maths", chapter: "siCi", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_maths_ratio_001", title: "Ratio & Proportion Test 01", subject: "Maths", chapter: "ratio", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_maths_timework_001", title: "Time & Work Test 01", subject: "Maths", chapter: "timeWork", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_maths_timedist_001", title: "Time & Distance Test 01", subject: "Maths", chapter: "timeDistance", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_maths_number_001", title: "Number System Test 01", subject: "Maths", chapter: "numberSystem", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_maths_algebra_001", title: "Algebra Test 01", subject: "Maths", chapter: "algebra", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_maths_geometry_001", title: "Geometry Test 01", subject: "Maths", chapter: "geometry", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_maths_trigo_001", title: "Trigonometry Test 01", subject: "Maths", chapter: "trigonometry", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_maths_mensuration_001", title: "Mensuration Test 01", subject: "Maths", chapter: "mensuration", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_maths_di_001", title: "Data Interpretation Test 01", subject: "Maths", chapter: "dataInterpretation", exam: "CHSL", testType: "chapterwise", questions: 20, time: 18, difficulty: "easy", isNew: true },

    // --- CHSL Reasoning Chapterwise ---
    { id: "chsl_chapter_reasoning_analogy_001", title: "Analogy Test 01", subject: "Reasoning", chapter: "analogy", exam: "CHSL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_reasoning_classification_001", title: "Classification Test 01", subject: "Reasoning", chapter: "classification", exam: "CHSL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_reasoning_series_001", title: "Series Test 01", subject: "Reasoning", chapter: "series", exam: "CHSL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_reasoning_coding_001", title: "Coding-Decoding Test 01", subject: "Reasoning", chapter: "codingDecoding", exam: "CHSL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_reasoning_blood_001", title: "Blood Relation Test 01", subject: "Reasoning", chapter: "bloodRelation", exam: "CHSL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_reasoning_direction_001", title: "Direction Test 01", subject: "Reasoning", chapter: "direction", exam: "CHSL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_reasoning_syllogism_001", title: "Syllogism Test 01", subject: "Reasoning", chapter: "syllogism", exam: "CHSL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_reasoning_puzzle_001", title: "Puzzle Test 01", subject: "Reasoning", chapter: "puzzle", exam: "CHSL", testType: "chapterwise", questions: 15, time: 15, difficulty: "medium", isNew: true },
    { id: "chsl_chapter_reasoning_venn_001", title: "Venn Diagram Test 01", subject: "Reasoning", chapter: "vennDiagram", exam: "CHSL", testType: "chapterwise", questions: 20, time: 10, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_reasoning_mirror_001", title: "Mirror & Water Image Test 01", subject: "Reasoning", chapter: "mirrorImage", exam: "CHSL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_reasoning_paper_001", title: "Paper Folding Test 01", subject: "Reasoning", chapter: "paperFolding", exam: "CHSL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_reasoning_dice_001", title: "Dice & Cube Test 01", subject: "Reasoning", chapter: "diceCube", exam: "CHSL", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },

    // --- CHSL English Chapterwise ---
    { id: "chsl_chapter_english_vocab_001", title: "Vocabulary Test 01", subject: "English", chapter: "vocabulary", exam: "CHSL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_english_synonyms_001", title: "Synonyms Test 01", subject: "English", chapter: "synonyms", exam: "CHSL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_english_antonyms_001", title: "Antonyms Test 01", subject: "English", chapter: "antonyms", exam: "CHSL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_english_idioms_001", title: "Idioms & Phrases Test 01", subject: "English", chapter: "idiomsPhrases", exam: "CHSL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_english_oneword_001", title: "One Word Substitution Test 01", subject: "English", chapter: "oneWord", exam: "CHSL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_english_error_001", title: "Error Spotting Test 01", subject: "English", chapter: "errorSpotting", exam: "CHSL", testType: "chapterwise", questions: 25, time: 12, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_english_fill_001", title: "Fill in the Blanks Test 01", subject: "English", chapter: "fillBlanks", exam: "CHSL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_english_cloze_001", title: "Cloze Test 01", subject: "English", chapter: "clozeTest", exam: "CHSL", testType: "chapterwise", questions: 20, time: 12, difficulty: "medium", isNew: true },
    { id: "chsl_chapter_english_rc_001", title: "Reading Comprehension Test 01", subject: "English", chapter: "readingComprehension", exam: "CHSL", testType: "chapterwise", questions: 20, time: 15, difficulty: "medium", isNew: true },
    { id: "chsl_chapter_english_sentence_001", title: "Sentence Improvement Test 01", subject: "English", chapter: "sentenceImprovement", exam: "CHSL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_english_voice_001", title: "Active-Passive Voice Test 01", subject: "English", chapter: "activePassive", exam: "CHSL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_english_speech_001", title: "Direct-Indirect Speech Test 01", subject: "English", chapter: "directIndirect", exam: "CHSL", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },

    // --- CHSL GK Chapterwise ---
    { id: "chsl_chapter_gk_history_001", title: "History Test 01", subject: "GK", chapter: "history", exam: "CHSL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_gk_geography_001", title: "Geography Test 01", subject: "GK", chapter: "geography", exam: "CHSL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_gk_polity_001", title: "Polity Test 01", subject: "GK", chapter: "polity", exam: "CHSL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_gk_economy_001", title: "Economy Test 01", subject: "GK", chapter: "economy", exam: "CHSL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_gk_science_001", title: "General Science Test 01", subject: "GK", chapter: "generalScience", exam: "CHSL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_gk_physics_001", title: "Physics Test 01", subject: "GK", chapter: "physics", exam: "CHSL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_gk_chemistry_001", title: "Chemistry Test 01", subject: "GK", chapter: "chemistry", exam: "CHSL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_gk_biology_001", title: "Biology Test 01", subject: "GK", chapter: "biology", exam: "CHSL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_gk_current_001", title: "Current Affairs Nov 2024", subject: "GK", chapter: "currentAffairs", exam: "CHSL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_gk_static_001", title: "Static GK Test 01", subject: "GK", chapter: "staticGK", exam: "CHSL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "chsl_chapter_gk_computer_001", title: "Computer Knowledge Test 01", subject: "GK", chapter: "computer", exam: "CHSL", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    // ============================================
    // SSC CHSL - TOP 100 MATHS (Special)
    // ============================================
    {
        id: "chsl_top100_maths_001",
        title: "Top 100 Maths - Set 1",
        exam: "CHSL",
        testType: "top100",
        subject: "Top100Maths",
        questions: 50,
        time: 60,
        isNew: true
    },
    {
        id: "chsl_top100_maths_002",
        title: "Top 100 Maths - Set 2",
        exam: "CHSL",
        testType: "top100",
        subject: "Top100Maths",
        questions: 50,
        time: 60,
        isNew: true
    },

    // ============================================
    // SSC CPO - SHIFTWISE SUBJECT TESTS
    // (9 Dec - 12 Dec 2025)
    // ============================================

    // ========== CPO MATHS SHIFTWISE ==========
    
    // 9 Dec
    { id: "cpo_shift_maths_09dec_s1", date: "9 Dec", title: "Shift 1", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_maths_09dec_s2", date: "9 Dec", title: "Shift 2", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_maths_09dec_s3", date: "9 Dec", title: "Shift 3", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 10 Dec
    { id: "cpo_shift_maths_10dec_s1", date: "10 Dec", title: "Shift 1", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_maths_10dec_s2", date: "10 Dec", title: "Shift 2", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_maths_10dec_s3", date: "10 Dec", title: "Shift 3", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 11 Dec
    { id: "cpo_shift_maths_11dec_s1", date: "11 Dec", title: "Shift 1", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_maths_11dec_s2", date: "11 Dec", title: "Shift 2", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_maths_11dec_s3", date: "11 Dec", title: "Shift 3", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 12 Dec
    { id: "cpo_shift_maths_12dec_s1", date: "12 Dec", title: "Shift 1", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_maths_12dec_s2", date: "12 Dec", title: "Shift 2", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_maths_12dec_s3", date: "12 Dec", title: "Shift 3", subject: "Maths", exam: "CPO", testType: "shiftwise", isNew: true },

    // ========== CPO REASONING SHIFTWISE ==========
    
    // 9 Dec
    { id: "cpo_shift_reasoning_09dec_s1", date: "9 Dec", title: "Shift 1", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_reasoning_09dec_s2", date: "9 Dec", title: "Shift 2", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_reasoning_09dec_s3", date: "9 Dec", title: "Shift 3", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 10 Dec
    { id: "cpo_shift_reasoning_10dec_s1", date: "10 Dec", title: "Shift 1", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_reasoning_10dec_s2", date: "10 Dec", title: "Shift 2", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_reasoning_10dec_s3", date: "10 Dec", title: "Shift 3", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 11 Dec
    { id: "cpo_shift_reasoning_11dec_s1", date: "11 Dec", title: "Shift 1", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_reasoning_11dec_s2", date: "11 Dec", title: "Shift 2", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_reasoning_11dec_s3", date: "11 Dec", title: "Shift 3", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 12 Dec
    { id: "cpo_shift_reasoning_12dec_s1", date: "12 Dec", title: "Shift 1", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_reasoning_12dec_s2", date: "12 Dec", title: "Shift 2", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_reasoning_12dec_s3", date: "12 Dec", title: "Shift 3", subject: "Reasoning", exam: "CPO", testType: "shiftwise", isNew: true },

    // ========== CPO ENGLISH SHIFTWISE ==========
    
    // 9 Dec
    { id: "cpo_shift_english_09dec_s1", date: "9 Dec", title: "Shift 1", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_english_09dec_s2", date: "9 Dec", title: "Shift 2", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_english_09dec_s3", date: "9 Dec", title: "Shift 3", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 10 Dec
    { id: "cpo_shift_english_10dec_s1", date: "10 Dec", title: "Shift 1", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_english_10dec_s2", date: "10 Dec", title: "Shift 2", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_english_10dec_s3", date: "10 Dec", title: "Shift 3", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 11 Dec
    { id: "cpo_shift_english_11dec_s1", date: "11 Dec", title: "Shift 1", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_english_11dec_s2", date: "11 Dec", title: "Shift 2", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_english_11dec_s3", date: "11 Dec", title: "Shift 3", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 12 Dec
    { id: "cpo_shift_english_12dec_s1", date: "12 Dec", title: "Shift 1", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_english_12dec_s2", date: "12 Dec", title: "Shift 2", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_english_12dec_s3", date: "12 Dec", title: "Shift 3", subject: "English", exam: "CPO", testType: "shiftwise", isNew: true },

    // ========== CPO GK SHIFTWISE ==========
    
    // 9 Dec
    { id: "cpo_shift_gk_09dec_s1", date: "9 Dec", title: "Shift 1", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_gk_09dec_s2", date: "9 Dec", title: "Shift 2", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_gk_09dec_s3", date: "9 Dec", title: "Shift 3", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 10 Dec
    { id: "cpo_shift_gk_10dec_s1", date: "10 Dec", title: "Shift 1", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_gk_10dec_s2", date: "10 Dec", title: "Shift 2", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_gk_10dec_s3", date: "10 Dec", title: "Shift 3", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 11 Dec
    { id: "cpo_shift_gk_11dec_s1", date: "11 Dec", title: "Shift 1", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_gk_11dec_s2", date: "11 Dec", title: "Shift 2", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_gk_11dec_s3", date: "11 Dec", title: "Shift 3", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },
    
    // 12 Dec
    { id: "cpo_shift_gk_12dec_s1", date: "12 Dec", title: "Shift 1", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_gk_12dec_s2", date: "12 Dec", title: "Shift 2", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },
    { id: "cpo_shift_gk_12dec_s3", date: "12 Dec", title: "Shift 3", subject: "GK", exam: "CPO", testType: "shiftwise", isNew: true },

    // ============================================
    // SSC CPO - FULL MOCK TESTS
    // ============================================
    {
        id: "cpo_full_001",
        title: "Full Mock Test 01",
        date: "2025",
        exam: "CPO",
        testType: "full",
        questions: 200,
        time: 120,
        sections: ["Maths", "Reasoning", "English", "GK"],
        isNew: true,
        isPremium: false
    },
    {
        id: "cpo_full_002",
        title: "Full Mock Test 02",
        date: "2025",
        exam: "CPO",
        testType: "full",
        questions: 200,
        time: 120,
        sections: ["Maths", "Reasoning", "English", "GK"],
        isNew: true,
        isPremium: false
    },
    {
        id: "cpo_full_003",
        title: "Full Mock Test 03",
        date: "2025",
        exam: "CPO",
        testType: "full",
        questions: 200,
        time: 120,
        sections: ["Maths", "Reasoning", "English", "GK"],
        isNew: false,
        isPremium: true
    },

    // ============================================
    // SSC CPO - CHAPTERWISE TESTS
    // ============================================
    
    // --- CPO Maths Chapterwise ---
    { id: "cpo_chapter_maths_percentage_001", title: "Percentage Test 01", subject: "Maths", chapter: "percentage", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_maths_percentage_002", title: "Percentage Test 02", subject: "Maths", chapter: "percentage", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "medium", isNew: false },
    { id: "cpo_chapter_maths_profitloss_001", title: "Profit & Loss Test 01", subject: "Maths", chapter: "profitLoss", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_maths_sici_001", title: "SI & CI Test 01", subject: "Maths", chapter: "siCi", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_maths_ratio_001", title: "Ratio & Proportion Test 01", subject: "Maths", chapter: "ratio", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_maths_timework_001", title: "Time & Work Test 01", subject: "Maths", chapter: "timeWork", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_maths_timedist_001", title: "Time & Distance Test 01", subject: "Maths", chapter: "timeDistance", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_maths_number_001", title: "Number System Test 01", subject: "Maths", chapter: "numberSystem", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_maths_algebra_001", title: "Algebra Test 01", subject: "Maths", chapter: "algebra", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_maths_geometry_001", title: "Geometry Test 01", subject: "Maths", chapter: "geometry", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_maths_trigo_001", title: "Trigonometry Test 01", subject: "Maths", chapter: "trigonometry", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_maths_mensuration_001", title: "Mensuration Test 01", subject: "Maths", chapter: "mensuration", exam: "CPO", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_maths_di_001", title: "Data Interpretation Test 01", subject: "Maths", chapter: "dataInterpretation", exam: "CPO", testType: "chapterwise", questions: 20, time: 18, difficulty: "easy", isNew: true },

    // --- CPO Reasoning Chapterwise ---
    { id: "cpo_chapter_reasoning_analogy_001", title: "Analogy Test 01", subject: "Reasoning", chapter: "analogy", exam: "CPO", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_reasoning_classification_001", title: "Classification Test 01", subject: "Reasoning", chapter: "classification", exam: "CPO", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_reasoning_series_001", title: "Series Test 01", subject: "Reasoning", chapter: "series", exam: "CPO", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_reasoning_coding_001", title: "Coding-Decoding Test 01", subject: "Reasoning", chapter: "codingDecoding", exam: "CPO", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_reasoning_blood_001", title: "Blood Relation Test 01", subject: "Reasoning", chapter: "bloodRelation", exam: "CPO", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_reasoning_direction_001", title: "Direction Test 01", subject: "Reasoning", chapter: "direction", exam: "CPO", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_reasoning_syllogism_001", title: "Syllogism Test 01", subject: "Reasoning", chapter: "syllogism", exam: "CPO", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_reasoning_puzzle_001", title: "Puzzle Test 01", subject: "Reasoning", chapter: "puzzle", exam: "CPO", testType: "chapterwise", questions: 15, time: 15, difficulty: "medium", isNew: true },
    { id: "cpo_chapter_reasoning_venn_001", title: "Venn Diagram Test 01", subject: "Reasoning", chapter: "vennDiagram", exam: "CPO", testType: "chapterwise", questions: 20, time: 10, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_reasoning_mirror_001", title: "Mirror & Water Image Test 01", subject: "Reasoning", chapter: "mirrorImage", exam: "CPO", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_reasoning_paper_001", title: "Paper Folding Test 01", subject: "Reasoning", chapter: "paperFolding", exam: "CPO", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_reasoning_dice_001", title: "Dice & Cube Test 01", subject: "Reasoning", chapter: "diceCube", exam: "CPO", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },

    // --- CPO English Chapterwise ---
    { id: "cpo_chapter_english_vocab_001", title: "Vocabulary Test 01", subject: "English", chapter: "vocabulary", exam: "CPO", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_english_synonyms_001", title: "Synonyms Test 01", subject: "English", chapter: "synonyms", exam: "CPO", testType: "chapterwise", questions: 25, time: 10, difficulty: "easy", isNew: true },
    { id: "cpo_chapter_english_antonyms_001", title: "Antonyms Test 01", subject: "English", chapter: "antonyms", exam: "CPO", testType: "chapterwise", questions

        // ============================================
    // DP CONSTABLE - SHIFTWISE SUBJECT TESTS
    // (18 Dec 2025 - 6 Jan 2026)
    // Note: DP doesn't have English subject
    // ============================================

    // ========== DP MATHS SHIFTWISE ==========
    
    // 18 Dec
    { id: "dp_shift_maths_18dec_s1", date: "18 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_18dec_s2", date: "18 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_18dec_s3", date: "18 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 19 Dec
    { id: "dp_shift_maths_19dec_s1", date: "19 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_19dec_s2", date: "19 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_19dec_s3", date: "19 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 20 Dec
    { id: "dp_shift_maths_20dec_s1", date: "20 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_20dec_s2", date: "20 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_20dec_s3", date: "20 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 21 Dec
    { id: "dp_shift_maths_21dec_s1", date: "21 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_21dec_s2", date: "21 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_21dec_s3", date: "21 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 22 Dec
    { id: "dp_shift_maths_22dec_s1", date: "22 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_22dec_s2", date: "22 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_22dec_s3", date: "22 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 23 Dec
    { id: "dp_shift_maths_23dec_s1", date: "23 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_23dec_s2", date: "23 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_23dec_s3", date: "23 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 24 Dec
    { id: "dp_shift_maths_24dec_s1", date: "24 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_24dec_s2", date: "24 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_24dec_s3", date: "24 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 25 Dec
    { id: "dp_shift_maths_25dec_s1", date: "25 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_25dec_s2", date: "25 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_25dec_s3", date: "25 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 26 Dec
    { id: "dp_shift_maths_26dec_s1", date: "26 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_26dec_s2", date: "26 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_26dec_s3", date: "26 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 27 Dec
    { id: "dp_shift_maths_27dec_s1", date: "27 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_27dec_s2", date: "27 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_27dec_s3", date: "27 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 28 Dec
    { id: "dp_shift_maths_28dec_s1", date: "28 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_28dec_s2", date: "28 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_28dec_s3", date: "28 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 29 Dec
    { id: "dp_shift_maths_29dec_s1", date: "29 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_29dec_s2", date: "29 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_29dec_s3", date: "29 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 30 Dec
    { id: "dp_shift_maths_30dec_s1", date: "30 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_30dec_s2", date: "30 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_30dec_s3", date: "30 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 31 Dec
    { id: "dp_shift_maths_31dec_s1", date: "31 Dec", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_31dec_s2", date: "31 Dec", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_31dec_s3", date: "31 Dec", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 1 Jan
    { id: "dp_shift_maths_01jan_s1", date: "1 Jan", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_01jan_s2", date: "1 Jan", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_01jan_s3", date: "1 Jan", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 2 Jan
    { id: "dp_shift_maths_02jan_s1", date: "2 Jan", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_02jan_s2", date: "2 Jan", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_02jan_s3", date: "2 Jan", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 3 Jan
    { id: "dp_shift_maths_03jan_s1", date: "3 Jan", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_03jan_s2", date: "3 Jan", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_03jan_s3", date: "3 Jan", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 4 Jan
    { id: "dp_shift_maths_04jan_s1", date: "4 Jan", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_04jan_s2", date: "4 Jan", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_04jan_s3", date: "4 Jan", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 5 Jan
    { id: "dp_shift_maths_05jan_s1", date: "5 Jan", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_05jan_s2", date: "5 Jan", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_05jan_s3", date: "5 Jan", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 6 Jan
    { id: "dp_shift_maths_06jan_s1", date: "6 Jan", title: "Shift 1", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_06jan_s2", date: "6 Jan", title: "Shift 2", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_maths_06jan_s3", date: "6 Jan", title: "Shift 3", subject: "Maths", exam: "DP", testType: "shiftwise", isNew: true },

    // ========== DP REASONING SHIFTWISE ==========
    
    // 18 Dec
    { id: "dp_shift_reasoning_18dec_s1", date: "18 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_18dec_s2", date: "18 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_18dec_s3", date: "18 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 19 Dec
    { id: "dp_shift_reasoning_19dec_s1", date: "19 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_19dec_s2", date: "19 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_19dec_s3", date: "19 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 20 Dec
    { id: "dp_shift_reasoning_20dec_s1", date: "20 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_20dec_s2", date: "20 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_20dec_s3", date: "20 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 21 Dec
    { id: "dp_shift_reasoning_21dec_s1", date: "21 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_21dec_s2", date: "21 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_21dec_s3", date: "21 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 22 Dec
    { id: "dp_shift_reasoning_22dec_s1", date: "22 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_22dec_s2", date: "22 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_22dec_s3", date: "22 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 23 Dec
    { id: "dp_shift_reasoning_23dec_s1", date: "23 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_23dec_s2", date: "23 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_23dec_s3", date: "23 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 24 Dec
    { id: "dp_shift_reasoning_24dec_s1", date: "24 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_24dec_s2", date: "24 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_24dec_s3", date: "24 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 25 Dec
    { id: "dp_shift_reasoning_25dec_s1", date: "25 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_25dec_s2", date: "25 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_25dec_s3", date: "25 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 26 Dec
    { id: "dp_shift_reasoning_26dec_s1", date: "26 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_26dec_s2", date: "26 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_26dec_s3", date: "26 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 27 Dec
    { id: "dp_shift_reasoning_27dec_s1", date: "27 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_27dec_s2", date: "27 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_27dec_s3", date: "27 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 28 Dec
    { id: "dp_shift_reasoning_28dec_s1", date: "28 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_28dec_s2", date: "28 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_28dec_s3", date: "28 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 29 Dec
    { id: "dp_shift_reasoning_29dec_s1", date: "29 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_29dec_s2", date: "29 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_29dec_s3", date: "29 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 30 Dec
    { id: "dp_shift_reasoning_30dec_s1", date: "30 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_30dec_s2", date: "30 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_30dec_s3", date: "30 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 31 Dec
    { id: "dp_shift_reasoning_31dec_s1", date: "31 Dec", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_31dec_s2", date: "31 Dec", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_31dec_s3", date: "31 Dec", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 1 Jan
    { id: "dp_shift_reasoning_01jan_s1", date: "1 Jan", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_01jan_s2", date: "1 Jan", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_01jan_s3", date: "1 Jan", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 2 Jan
    { id: "dp_shift_reasoning_02jan_s1", date: "2 Jan", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_02jan_s2", date: "2 Jan", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_02jan_s3", date: "2 Jan", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 3 Jan
    { id: "dp_shift_reasoning_03jan_s1", date: "3 Jan", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_03jan_s2", date: "3 Jan", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_03jan_s3", date: "3 Jan", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 4 Jan
    { id: "dp_shift_reasoning_04jan_s1", date: "4 Jan", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_04jan_s2", date: "4 Jan", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_04jan_s3", date: "4 Jan", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 5 Jan
    { id: "dp_shift_reasoning_05jan_s1", date: "5 Jan", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_05jan_s2", date: "5 Jan", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_05jan_s3", date: "5 Jan", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 6 Jan
    { id: "dp_shift_reasoning_06jan_s1", date: "6 Jan", title: "Shift 1", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_06jan_s2", date: "6 Jan", title: "Shift 2", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_reasoning_06jan_s3", date: "6 Jan", title: "Shift 3", subject: "Reasoning", exam: "DP", testType: "shiftwise", isNew: true },

    // ========== DP GK SHIFTWISE ==========
    
    // 18 Dec
    { id: "dp_shift_gk_18dec_s1", date: "18 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_18dec_s2", date: "18 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_18dec_s3", date: "18 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 19 Dec
    { id: "dp_shift_gk_19dec_s1", date: "19 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_19dec_s2", date: "19 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_19dec_s3", date: "19 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 20 Dec
    { id: "dp_shift_gk_20dec_s1", date: "20 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_20dec_s2", date: "20 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_20dec_s3", date: "20 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 21 Dec
    { id: "dp_shift_gk_21dec_s1", date: "21 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_21dec_s2", date: "21 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_21dec_s3", date: "21 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 22 Dec
    { id: "dp_shift_gk_22dec_s1", date: "22 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_22dec_s2", date: "22 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_22dec_s3", date: "22 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 23 Dec
    { id: "dp_shift_gk_23dec_s1", date: "23 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_23dec_s2", date: "23 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_23dec_s3", date: "23 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 24 Dec
    { id: "dp_shift_gk_24dec_s1", date: "24 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_24dec_s2", date: "24 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_24dec_s3", date: "24 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 25 Dec
    { id: "dp_shift_gk_25dec_s1", date: "25 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_25dec_s2", date: "25 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_25dec_s3", date: "25 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 26 Dec
    { id: "dp_shift_gk_26dec_s1", date: "26 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_26dec_s2", date: "26 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_26dec_s3", date: "26 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 27 Dec
    { id: "dp_shift_gk_27dec_s1", date: "27 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_27dec_s2", date: "27 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_27dec_s3", date: "27 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 28 Dec
    { id: "dp_shift_gk_28dec_s1", date: "28 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_28dec_s2", date: "28 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_28dec_s3", date: "28 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 29 Dec
    { id: "dp_shift_gk_29dec_s1", date: "29 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_29dec_s2", date: "29 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_29dec_s3", date: "29 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 30 Dec
    { id: "dp_shift_gk_30dec_s1", date: "30 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_30dec_s2", date: "30 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_30dec_s3", date: "30 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 31 Dec
    { id: "dp_shift_gk_31dec_s1", date: "31 Dec", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_31dec_s2", date: "31 Dec", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_31dec_s3", date: "31 Dec", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 1 Jan
    { id: "dp_shift_gk_01jan_s1", date: "1 Jan", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_01jan_s2", date: "1 Jan", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_01jan_s3", date: "1 Jan", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 2 Jan
    { id: "dp_shift_gk_02jan_s1", date: "2 Jan", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_02jan_s2", date: "2 Jan", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_02jan_s3", date: "2 Jan", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 3 Jan
    { id: "dp_shift_gk_03jan_s1", date: "3 Jan", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_03jan_s2", date: "3 Jan", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_03jan_s3", date: "3 Jan", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 4 Jan
    { id: "dp_shift_gk_04jan_s1", date: "4 Jan", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_04jan_s2", date: "4 Jan", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_04jan_s3", date: "4 Jan", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 5 Jan
    { id: "dp_shift_gk_05jan_s1", date: "5 Jan", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_05jan_s2", date: "5 Jan", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_05jan_s3", date: "5 Jan", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    
    // 6 Jan
    { id: "dp_shift_gk_06jan_s1", date: "6 Jan", title: "Shift 1", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_06jan_s2", date: "6 Jan", title: "Shift 2", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },
    { id: "dp_shift_gk_06jan_s3", date: "6 Jan", title: "Shift 3", subject: "GK", exam: "DP", testType: "shiftwise", isNew: true },

    // ============================================
    // DP CONSTABLE - FULL MOCK TESTS
    // ============================================
    {
        id: "dp_full_001",
        title: "Full Mock Test 01",
        date: "2025",
        exam: "DP",
        testType: "full",
        questions: 100,
        time: 90,
        sections: ["Maths", "Reasoning", "GK"],
        isNew: true,
        isPremium: false
    },
    {
        id: "dp_full_002",
        title: "Full Mock Test 02",
        date: "2025",
        exam: "DP",
        testType: "full",
        questions: 100,
        time: 90,
        sections: ["Maths", "Reasoning", "GK"],
        isNew: true,
        isPremium: false
    },
    {
        id: "dp_full_003",
        title: "Full Mock Test 03",
        date: "2025",
        exam: "DP",
        testType: "full",
        questions: 100,
        time: 90,
        sections: ["Maths", "Reasoning", "GK"],
        isNew: false,
        isPremium: true
    },

    // ============================================
    // DP CONSTABLE - CHAPTERWISE TESTS
    // (Note: DP doesn't have English)
    // ============================================
    
    // --- DP Maths Chapterwise ---
    { id: "dp_chapter_maths_percentage_001", title: "Percentage Test 01", subject: "Maths", chapter: "percentage", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "dp_chapter_maths_percentage_002", title: "Percentage Test 02", subject: "Maths", chapter: "percentage", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "medium", isNew: false },
    { id: "dp_chapter_maths_profitloss_001", title: "Profit & Loss Test 01", subject: "Maths", chapter: "profitLoss", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "dp_chapter_maths_sici_001", title: "SI & CI Test 01", subject: "Maths", chapter: "siCi", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "dp_chapter_maths_ratio_001", title: "Ratio & Proportion Test 01", subject: "Maths", chapter: "ratio", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "dp_chapter_maths_timework_001", title: "Time & Work Test 01", subject: "Maths", chapter: "timeWork", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "dp_chapter_maths_timedist_001", title: "Time & Distance Test 01", subject: "Maths", chapter: "timeDistance", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "dp_chapter_maths_number_001", title: "Number System Test 01", subject: "Maths", chapter: "numberSystem", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "dp_chapter_maths_algebra_001", title: "Algebra Test 01", subject: "Maths", chapter: "algebra", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "dp_chapter_maths_geometry_001", title: "Geometry Test 01", subject: "Maths", chapter: "geometry", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "dp_chapter_maths_trigo_001", title: "Trigonometry Test 01", subject: "Maths", chapter: "trigonometry", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "dp_chapter_maths_mensuration_001", title: "Mensuration Test 01", subject: "Maths", chapter: "mensuration", exam: "DP", testType: "chapterwise", questions: 20, time: 15, difficulty: "easy", isNew: true },
    { id: "dp_chapter_maths_di_001", title: "Data Interpretation Test 01", subject: "Maths", chapter: "dataInterpretation", exam: "DP", testType: "chapterwise", questions: 20, time: 18, difficulty: "easy", isNew: true },

    // --- DP Reasoning Chapterwise ---
    { id: "dp_chapter_reasoning_analogy_001", title: "Analogy Test 01", subject: "Reasoning", chapter: "analogy", exam: "DP", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "dp_chapter_reasoning_classification_001", title: "Classification Test 01", subject: "Reasoning", chapter: "classification", exam: "DP", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "dp_chapter_reasoning_series_001", title: "Series Test 01", subject: "Reasoning", chapter: "series", exam: "DP", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "dp_chapter_reasoning_coding_001", title: "Coding-Decoding Test 01", subject: "Reasoning", chapter: "codingDecoding", exam: "DP", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "dp_chapter_reasoning_blood_001", title: "Blood Relation Test 01", subject: "Reasoning", chapter: "bloodRelation", exam: "DP", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "dp_chapter_reasoning_direction_001", title: "Direction Test 01", subject: "Reasoning", chapter: "direction", exam: "DP", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "dp_chapter_reasoning_syllogism_001", title: "Syllogism Test 01", subject: "Reasoning", chapter: "syllogism", exam: "DP", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "dp_chapter_reasoning_puzzle_001", title: "Puzzle Test 01", subject: "Reasoning", chapter: "puzzle", exam: "DP", testType: "chapterwise", questions: 15, time: 15, difficulty: "medium", isNew: true },
    { id: "dp_chapter_reasoning_venn_001", title: "Venn Diagram Test 01", subject: "Reasoning", chapter: "vennDiagram", exam: "DP", testType: "chapterwise", questions: 20, time: 10, difficulty: "easy", isNew: true },
    { id: "dp_chapter_reasoning_mirror_001", title: "Mirror & Water Image Test 01", subject: "Reasoning", chapter: "mirrorImage", exam: "DP", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "dp_chapter_reasoning_paper_001", title: "Paper Folding Test 01", subject: "Reasoning", chapter: "paperFolding", exam: "DP", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },
    { id: "dp_chapter_reasoning_dice_001", title: "Dice & Cube Test 01", subject: "Reasoning", chapter: "diceCube", exam: "DP", testType: "chapterwise", questions: 20, time: 12, difficulty: "easy", isNew: true },

    // --- DP GK Chapterwise ---
    { id: "dp_chapter_gk_history_001", title: "History Test 01", subject: "GK", chapter: "history", exam: "DP", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "dp_chapter_gk_geography_001", title: "Geography Test 01", subject: "GK", chapter: "geography", exam: "DP", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "dp_chapter_gk_polity_001", title: "Polity Test 01", subject: "GK", chapter: "polity", exam: "DP", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "dp_chapter_gk_economy_001", title: "Economy Test 01", subject: "GK", chapter: "economy", exam: "DP", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "dp_chapter_gk_science_001", title: "General Science Test 01", subject: "GK", chapter: "generalScience", exam: "DP", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "dp_chapter_gk_physics_001", title: "Physics Test 01", subject: "GK", chapter: "physics", exam: "DP", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "dp_chapter_gk_chemistry_001", title: "Chemistry Test 01", subject: "GK", chapter: "chemistry", exam: "DP", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "dp_chapter_gk_biology_001", title: "Biology Test 01", subject: "GK", chapter: "biology", exam: "DP", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "dp_chapter_gk_current_001", title: "Current Affairs Jan 2026", subject: "GK", chapter: "currentAffairs", exam: "DP", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "dp_chapter_gk_static_001", title: "Static GK Test 01", subject: "GK", chapter: "staticGK", exam: "DP", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
    { id: "dp_chapter_gk_computer_001", title: "Computer Knowledge Test 01", subject: "GK", chapter: "computer", exam: "DP", testType: "chapterwise", questions: 25, time: 8, difficulty: "easy", isNew: true },
// ============================================
// CHAPTERS CONFIGURATION (for UI display)
// ============================================
const CHAPTERS_CONFIG = {
    Maths: [
        { id: 'percentage', name: 'Percentage', icon: '📊' },
        { id: 'profitLoss', name: 'Profit & Loss', icon: '💰' },
        { id: 'siCi', name: 'SI & CI', icon: '🏦' },
        { id: 'ratio', name: 'Ratio & Proportion', icon: '⚖️' },
        { id: 'timeWork', name: 'Time & Work', icon: '⏱️' },
        { id: 'timeDistance', name: 'Time & Distance', icon: '🚗' },
        { id: 'numberSystem', name: 'Number System', icon: '🔢' },
        { id: 'algebra', name: 'Algebra', icon: '📈' },
        { id: 'geometry', name: 'Geometry', icon: '📐' },
        { id: 'trigonometry', name: 'Trigonometry', icon: '📏' },
        { id: 'mensuration', name: 'Mensuration', icon: '📦' },
        { id: 'dataInterpretation', name: 'Data Interpretation', icon: '📉' }
    ],
    Reasoning: [
        { id: 'analogy', name: 'Analogy', icon: '🔗' },
        { id: 'classification', name: 'Classification', icon: '📁' },
        { id: 'series', name: 'Series', icon: '🔢' },
        { id: 'codingDecoding', name: 'Coding-Decoding', icon: '🔐' },
        { id: 'bloodRelation', name: 'Blood Relation', icon: '👨‍👩‍👧' },
        { id: 'direction', name: 'Direction', icon: '🧭' },
        { id: 'syllogism', name: 'Syllogism', icon: '🎯' },
        { id: 'puzzle', name: 'Puzzle', icon: '🧩' },
        { id: 'vennDiagram', name: 'Venn Diagram', icon: '⭕' },
        { id: 'mirrorImage', name: 'Mirror & Water Image', icon: '🪞' },
        { id: 'paperFolding', name: 'Paper Folding', icon: '📄' },
        { id: 'diceCube', name: 'Dice & Cube', icon: '🎲' }
    ],
    English: [
        { id: 'vocabulary', name: 'Vocabulary', icon: '📖' },
        { id: 'synonyms', name: 'Synonyms', icon: '🔤' },
        { id: 'antonyms', name: 'Antonyms', icon: '🔡' },
        { id: 'idiomsPhrases', name: 'Idioms & Phrases', icon: '💬' },
        { id: 'oneWord', name: 'One Word Substitution', icon: '✏️' },
        { id: 'errorSpotting', name: 'Error Spotting', icon: '🔍' },
        { id: 'fillBlanks', name: 'Fill in the Blanks', icon: '📝' },
        { id: 'clozeTest', name: 'Cloze Test', icon: '📋' },
        { id: 'readingComprehension', name: 'Reading Comprehension', icon: '📚' },
        { id: 'sentenceImprovement', name: 'Sentence Improvement', icon: '✨' },
        { id: 'activePassive', name: 'Active-Passive Voice', icon: '🔄' },
        { id: 'directIndirect', name: 'Direct-Indirect Speech', icon: '💭' }
    ],
    GK: [
        { id: 'history', name: 'History', icon: '🏛️' },
        { id: 'geography', name: 'Geography', icon: '🌍' },
        { id: 'polity', name: 'Polity', icon: '⚖️' },
        { id: 'economy', name: 'Economy', icon: '💹' },
        { id: 'generalScience', name: 'General Science', icon: '🔬' },
        { id: 'physics', name: 'Physics', icon: '⚡' },
        { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
        { id: 'biology', name: 'Biology', icon: '🧬' },
        { id: 'currentAffairs', name: 'Current Affairs', icon: '📰' },
        { id: 'staticGK', name: 'Static GK', icon: '📌' },
        { id: 'computer', name: 'Computer Knowledge', icon: '💻' },
        { id: 'awards', name: 'Awards & Honours', icon: '🏆' }
    ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const TestHelper = {
    
    // Get shiftwise tests by exam and subject
    getShiftwiseTests(exam, subject) {
        return ALL_TESTS.filter(t => 
            t.exam === exam && 
            t.subject === subject && 
            t.testType === 'shiftwise'
        );
    },
    
    // Get full mock tests by exam
    getFullTests(exam) {
        return ALL_TESTS.filter(t => 
            t.exam === exam && 
            t.testType === 'full'
        );
    },
    
    // Get chapterwise tests by exam, subject, and chapter
    getChapterwiseTests(exam, subject, chapterId) {
        return ALL_TESTS.filter(t => 
            t.exam === exam && 
            t.subject === subject && 
            t.chapter === chapterId && 
            t.testType === 'chapterwise'
        );
    },
    
    // Get all chapters with test counts for a subject
    getChaptersWithCounts(exam, subject) {
        const chapters = CHAPTERS_CONFIG[subject] || [];
        return chapters.map(chapter => ({
            ...chapter,
            testCount: this.getChapterwiseTests(exam, subject, chapter.id).length
        }));
    },
    
    // Get Top 100 tests (CHSL special)
    getTop100Tests(exam) {
        return ALL_TESTS.filter(t => 
            t.exam === exam && 
            t.testType === 'top100'
        );
    },
    
    // Get test by ID
    getTestById(testId) {
        return ALL_TESTS.find(t => t.id === testId);
    },
    
    // Get all tests for an exam
    getAllTestsByExam(exam) {
        return ALL_TESTS.filter(t => t.exam === exam);
    },
    
    // Count tests by type
    getTestCounts(exam) {
        const examTests = this.getAllTestsByExam(exam);
        return {
            shiftwise: examTests.filter(t => t.testType === 'shiftwise').length,
            full: examTests.filter(t => t.testType === 'full').length,
            chapterwise: examTests.filter(t => t.testType === 'chapterwise').length,
            top100: examTests.filter(t => t.testType === 'top100').length,
            total: examTests.length
        };
    }
};
