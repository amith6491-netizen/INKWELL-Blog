const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

// @desc    Get all blogs (with search, filter, pagination)
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = async (req, res) => {
  try {
    const {
      search,
      category,
      author,
      page = 1,
      limit = 9,
      sort = '-createdAt',
      tag,
    } = req.query;

    const query = { isPublished: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Author filter
    if (author) {
      query.author = author;
    }

    // Tag filter
    if (tag) {
      query.tags = tag.toLowerCase();
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('author', 'username avatar')
        .populate('commentCount')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Blog.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog by ID or slug
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const blog = await Blog.findOne(query)
      .populate('author', 'username avatar bio')
      .populate('commentCount');

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: 'Blog not found' });
    }

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  try {
    const { title, content, category, image, tags, excerpt } = req.body;

    const blog = await Blog.create({
      title,
      content,
      category,
      image,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      excerpt,
      author: req.user._id,
    });

    await blog.populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (author or admin)
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: 'Blog not found' });
    }

    // Authorization check
    const isAuthor = blog.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to edit this blog' });
    }

    const { title, content, category, image, tags, excerpt, isPublished } =
      req.body;

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        image,
        tags: tags ? tags.split(',').map((t) => t.trim()) : blog.tags,
        excerpt,
        isPublished: isPublished !== undefined ? isPublished : blog.isPublished,
      },
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (author or admin)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: 'Blog not found' });
    }

    const isAuthor = blog.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog',
      });
    }

    await Blog.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ blog: req.params.id });

    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle like on a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: 'Blog not found' });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = blog.likes.map((l) => l.toString()).includes(userId);

    const update = alreadyLiked
      ? { $pull: { likes: req.user._id } }
      : { $addToSet: { likes: req.user._id } };

    const updated = await Blog.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res.json({
      success: true,
      liked: !alreadyLiked,
      likeCount: updated.likes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get blogs by logged-in user
// @route   GET /api/blogs/my-blogs
// @access  Private
const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate('author', 'username avatar')
      .populate('commentCount')
      .sort('-createdAt');

    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  getMyBlogs,
};
