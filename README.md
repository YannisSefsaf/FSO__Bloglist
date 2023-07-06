# FSO__Bloglist

4.21*: bloglist expansion, step9
Change the delete blog operation so that a blog can be deleted only by the user who added the blog. Therefore, deleting a blog is possible only if the token sent with the request is the same as that of the blog's creator.

If deleting a blog is attempted without a token or by an invalid user, the operation should return a suitable status code.

Note that if you fetch a blog from the database,

const blog = await Blog.findById(...)copy
the field blog.user does not contain a string, but an Object. So if you want to compare the id of the object fetched from the database and a string id, a normal comparison operation does not work. The id fetched from the database must be parsed into a string first.

if ( blog.user.toString() === userid.toString() ) ...copy
4.22*: bloglist expansion, step10
Both the new blog creation and blog deletion need to find out the identity of the user who is doing the operation. The middleware tokenExtractor that we did in exercise 4.20 helps but still both the handlers of post and delete operations need to find out who the user holding a specific token is.

Now create a new middleware userExtractor, that finds out the user and sets it to the request object. When you register the middleware in app.js

app.use(middleware.userExtractor)copy
the user will be set in the field request.user:

blogsRouter.post('/', async (request, response) => {
  // get user from request object
  const user = request.user
  // ..
})

blogsRouter.delete('/:id', async (request, response) => {
  // get user from request object
  const user = request.user
  // ..
})copy
Note that it is possible to register a middleware only for a specific set of routes. So instead of using userExtractor with all the routes,

// use the middleware in all routes
app.use(userExtractor)

app.use('/api/blogs', blogsRouter)  
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)copy
we could register it to be only executed with path /api/blogs routes:

// use the middleware only in /api/blogs routes
app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)copy
As can be seen, this happens by chaining multiple middlewares as the parameter of function use. It would also be possible to register a middleware only for a specific operation:

router.post('/', userExtractor, async (request, response) => {
  // ...
}copy
4.23*: bloglist expansion, step11
After adding token-based authentication the tests for adding a new blog broke down. Fix the tests. Also, write a new test to ensure adding a blog fails with the proper status code 401 Unauthorized if a token is not provided.

This is most likely useful when doing the fix.

This is the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the exercise submission system.

