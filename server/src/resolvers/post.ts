import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Post } from '../entities'
import { CheckLogin } from '../middleware/checkLogin'
import { NewPostForm, PostMutationResponse, UpdatePostForm } from '../types'

@Resolver()
export class PostResolver {
  //create a new post
  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(CheckLogin)
  async createNewPost(
    @Arg('NewPostForm') { title, text }: NewPostForm,
  ): Promise<Post | PostMutationResponse> {
    try {
      let newPost = Post.create({
        title,
        text,
      })

      await newPost.save()

      return {
        code: 200,
        success: true,
        message: 'Create new post successful',
        post: newPost,
      }
    } catch (error) {
      console.log(`Error create new post: ${error}`)
      return {
        code: 500,
        message: `Internal server error: ${error.message}`,
        success: false,
      }
    }
  }

  //read all post
  @Query((_return) => [Post], { nullable: true })
  async posts(): Promise<Post[] | null> {
    try {
      return await Post.find()
    } catch (error) {
      console.log(`Error read post : ${error}`)

      return null
    }
  }

  //read with id post
  @Query((_return) => Post)
  async getPost(
    @Arg('postId', (_type) => ID) id: number,
  ): Promise<Post | null> {
    try {
      const post = await Post.findOne<Post>({ where: [{ id }] })

      return post
    } catch (error) {
      console.log(`Error get post: ${error}`)

      return null
    }
  }

  //Update post
  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(CheckLogin)
  async updatePost(
    @Arg('updatePostForm') { id, title, text }: UpdatePostForm,
  ): Promise<PostMutationResponse> {
    try {
      //find post
      const post = await Post.findOne({
        where: [{ id }],
      })

      if (!post) {
        return {
          code: 400,
          message: 'Post not found',
          success: false,
        }
      }
      //if post
      post.title = title
      post.text = text

      await post.save()

      return {
        code: 200,
        success: true,
        message: `Update post successfuly`,
        post: post,
      }
    } catch (error) {
      console.log(`Update post failse: ${error}`)

      return {
        code: 500,
        success: false,
        message: error.message,
      }
    }
  }

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(CheckLogin)
  async deletePost(
    @Arg('id', (_type) => ID) id: number,
  ): Promise<PostMutationResponse> {
    //find post
    try {
      const post = await Post.findOne({
        where: [{ id }],
      })

      if (!post) {
        return {
          code: 400,
          message: 'Post not found',
          success: false,
        }
      }

      await Post.delete({ id })

      return {
        code: 200,
        success: true,
        message: 'Deleted post',
      }
    } catch (error) {
      console.log(`Error delete post: ${error}`)

      return {
        code: 500,
        success: false,
        message: 'Internal server error',
      }
    }
  }
}
