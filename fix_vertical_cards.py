import re

with open('landing_page/src/components/BlogPostContent.tsx', 'r') as f:
    content = f.read()

# I will replace everything starting from the Prose Content down to the end of the Leave Comment Form
# We will split it into distinct cards.

new_structure = """              {/* Card 2: Main Prose Content */}
              <div className="bg-white shadow-xl w-full p-8 md:p-16 mb-8">
                <div 
                  className="prose prose-lg prose-nets max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
              </div>

              {/* Card 3: Author Bio */}
              <div className="bg-white shadow-xl w-full p-8 md:p-12 mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                <div className="w-24 h-24 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                  <img src="/photo04.jpeg" className="w-full h-full object-cover" alt={post.author} />
                </div>
                <div>
                  <h3 className="text-xl fw-700 text-navy mb-2">{post.author} - Author</h3>
                  <p className="text-sm text-muted mb-4 leading-relaxed">
                    ResultsPRO's dedicated content team bridging the gap between cutting edge ed-tech and practical classroom implementation.
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-nets-light text-navy hover:bg-gray-200 transition-colors">
                      <IconBrandFacebook size={16} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-nets-light text-navy hover:bg-gray-200 transition-colors">
                      <IconBrandTwitter size={16} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-nets-light text-navy hover:bg-gray-200 transition-colors">
                      <IconBrandLinkedin size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 4: Comments List */}
              <div className="bg-white shadow-xl w-full p-8 md:p-12 mb-8">
                <h3 className="text-2xl fw-700 text-navy mb-8">Comments</h3>
                
                {post.comments && post.comments.length > 0 ? (
                  <div className="space-y-8">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                          <img src="/photo13.jpeg" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="fw-700 text-navy text-sm">{comment.author}</span>
                            <button className="text-xs font-bold text-muted hover:text-navy flex items-center gap-1">
                              <IconMessageCircle size={14} /> Reply
                            </button>
                          </div>
                          <span className="text-[10px] text-muted uppercase tracking-wider block mb-3">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                          <p className="text-sm text-navy/80 leading-relaxed m-0 bg-nets-light p-4 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-nets-border">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-nets-light border border-nets-border rounded-xl p-8 text-center text-muted text-sm">
                    No comments yet. Be the first to share your thoughts!
                  </div>
                )}
              </div>

              {/* Card 5: Leave Comment Form */}
              <div className="bg-white shadow-xl w-full p-8 md:p-12">
                <h3 className="text-2xl fw-700 text-navy mb-8">Leave your Comments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-lg bg-nets-light border border-nets-border text-sm focus:outline-none focus:border-blue-500" />
                  <input type="text" placeholder="Last Name" className="w-full px-4 py-3 rounded-lg bg-nets-light border border-nets-border text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg bg-nets-light border border-nets-border text-sm focus:outline-none focus:border-blue-500 mb-4" />
                <textarea placeholder="Your Comment" rows={5} className="w-full px-4 py-3 rounded-lg bg-nets-light border border-nets-border text-sm focus:outline-none focus:border-blue-500 mb-6"></textarea>
                <button className="btn" style={{ backgroundColor: "var(--color-nets-red)", color: "white", padding: "0.75rem 2rem" }}>
                  Submit your Comment
                </button>
              </div>"""

pattern = r'\{\/\* Card 2: Main Prose Content \*\/\}.*?Submit your Comment\n                    <\/button>\n                  <\/div>\n                <\/div>\n\n              <\/div>'
content = re.sub(pattern, new_structure, content, flags=re.DOTALL)

with open('landing_page/src/components/BlogPostContent.tsx', 'w') as f:
    f.write(content)
