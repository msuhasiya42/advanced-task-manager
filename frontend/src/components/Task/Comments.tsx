import { UserOutlined } from '@ant-design/icons'
import { Avatar, Divider, Input, Popover, Tooltip, message } from 'antd'
import { formatDistanceToNow } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { CommentType, ReactionType } from './Types/types'
import { commentAPI } from '../../Api'
import { User } from '../Login/types'

interface CommentsProps {
    taskId: string
    user: User
}

interface ReactionPopupProps {
    reactions: { emoji: string }[];
    onSelectReaction: (emoji: string) => void;
}

const Comments = ({ taskId, user }: CommentsProps) => {

    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [showReplyInput, setShowReplyInput] = useState("");
    const [showReplies, setShowReplies] = useState<String[]>([]);

    const userId = user?._id
    const reactionOptions = ["👀", "👍", "❤️", "✅", "😂", "😮", "😢", "👏"];


    useEffect(() => {
        // Fetch comments for the task
        const fetchComments = async () => {
            try {
                const response = await commentAPI.getComments(taskId);
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [taskId]);

    const ReactionPopup: React.FC<ReactionPopupProps> = ({ reactions, onSelectReaction }) => {
        return (
            <div className="flex space-x-2 p-2 bg-white border rounded shadow-lg">
                {reactionOptions.map((emoji, index) => (
                    <span
                        key={index}
                        className="cursor-pointer text-xl transform transition-transform duration-300 hover:-translate-y-2 hover:scale-110"
                        onClick={() => onSelectReaction(emoji)}
                    >
                        {emoji}
                    </span>
                ))}
            </div>
        );
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await commentAPI.deleteComment(commentId);
            setComments((prevComments) =>
                prevComments.filter((comment) => comment._id !== commentId)
            );
            void message.success("Comment deleted successfully", 1.5);
        } catch (error) {
            console.error("Error deleting comment:", error);
            void message.error("Error deleting comment", 1.5);
        }
    };

    const handleDeleteReply = async (commentId: string, replyId: string) => {
        try {
            await commentAPI.deleteReply(replyId);
            setComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment._id === commentId) {
                        return {
                            ...comment,
                            replies: comment.replies.filter(
                                (reply) => reply._id !== replyId
                            ),
                        };
                    }
                    return comment;
                })
            );
            void message.success("Reply deleted successfully", 1.5);
        } catch (error) {
            console.error("Error deleting reply:", error);
            void message.error("Error deleting reply", 1.5);
        }
    }

    const handleAddComment = async () => {
        if (newComment.trim() === "") {
            void message.error("Comment cannot be empty", 1.5);
            return;
        }
        try {
            const response = await commentAPI.addComment(
                taskId,
                newComment,
                userId ?? ""
            );
            setComments([...comments, response.data.comment]);
            setNewComment("");
            void message.success("Comment added successfully", 1.5);
        } catch (error) {
            console.error("Error adding comment:", error);
            void message.error("Error adding comment", 1.5);
        }
    };

    const handleAddReply = async (commentId: string, content: string) => {
        setShowReplies((prevShowReplies) => [...prevShowReplies, commentId]);
        setShowReplyInput("")
        if (content.trim() === "") {
            void message.error("Reply cannot be empty", 1.5);
            return;
        }
        try {
            const response = await commentAPI.addReply(
                commentId,
                content,
                userId
            );
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId
                        ? { ...comment, replies: [...comment.replies, response.data.reply] }
                        : comment
                )
            );
            void message.success("Reply added successfully", 1.5);
        } catch (error) {
            console.error("Error adding reply:", error);
            void message.error("Error adding reply", 1.5);
        }
    };

    const handleReaction = async (commentId: string, emoji: string, isReply = false, parentId?: string) => {
        try {
            await commentAPI.addReaction(commentId, emoji, userId ?? "");

            setComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment._id === (isReply ? parentId : commentId)) {
                        const updateReactions = (reactions: ReactionType[]) => {
                            const normalizedReactions = reactions.map(reaction => ({
                                ...reaction,
                                user: typeof reaction.user === 'string' ? reaction.user : reaction.user._id,
                            }));

                            return normalizedReactions.some(
                                (reaction) => reaction.user === userId && reaction.emoji === emoji
                            )
                                ? normalizedReactions.filter(
                                    (reaction) => !(reaction.user === userId && reaction.emoji === emoji)
                                )
                                : [...normalizedReactions, { emoji, user: userId }];
                        };

                        if (isReply) {
                            return {
                                ...comment,
                                replies: comment.replies.map((reply) =>
                                    reply._id === commentId
                                        ? { ...reply, reactions: updateReactions(reply.reactions) }
                                        : reply
                                ),
                            };
                        } else {
                            return {
                                ...comment,
                                reactions: updateReactions(comment.reactions),
                            };
                        }
                    }
                    return comment;
                })
            );
        } catch (error) {
            console.error("Error adding reaction:", error);
            void message.error("Error adding reaction", 1.5);
        }
    };


    const toggleReplies = (commentId: string) => {
        setShowReplies((prevReplies) =>
            prevReplies.includes(commentId)
                ? prevReplies.filter((id) => id !== commentId)
                : [...prevReplies, commentId]
        );
    };

    return (
        <div className="mt-4">
            <label className="block mb-3 mt-8 font-bold text-gray-700">Comments</label>

            {/* Add comment box */}
            <div className="flex flex-col">
                <Input.TextArea
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                />
                <button onClick={handleAddComment} className="w-[130px] mt-2 my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded">
                    Add Comment
                </button>
            </div>


            {/* mapping over all comments */}
            {comments.length > 0 && <div className="border-2 p-4 rounded">
                {comments.map((comment) => (
                    <div key={comment._id} className="mb-4">
                        <div className="flex items-center mb-2">
                            <Avatar src={comment.author.picture} className="mr-2 border-blue-500" />
                            <span className="font-bold text-blue-500">{comment.author.name}</span>
                            <span className="ml-2 text-gray-500">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>

                        {/* comment and reaction of it */}
                        <div className="ml-10">
                            <Popover
                                placement="topLeft"
                                content={<ReactionPopup reactions={comment.reactions} onSelectReaction={(emoji) => handleReaction(comment._id, emoji)} />}
                                trigger="hover"
                            >
                                <p className="-mt-2">{comment.content}</p>
                            </Popover>

                            <div className="flex items-center mb-2">
                                {comment.reactions.map((reaction) => (
                                    <span key={reaction._id} className="bg-blue-200 rounded-lg p-1 mr-2 cursor-pointer" onClick={() => handleReaction(comment._id, reaction.emoji)}>
                                        {reaction.emoji}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* show reply button */}
                        {comment.replies.length > 0 && showReplies.includes(String(comment._id))
                            ? <button className="ml-10 text-blue-500" onClick={() => toggleReplies(comment._id)}>Hide Replies</button>
                            : comment.replies?.length > 0 && <button className="ml-10 text-blue-500" onClick={() => toggleReplies(comment._id)}>View Replies ({comment.replies?.length})</button>
                        }

                        {/* Delete comment button */}
                        {comment.author._id === userId &&
                            <button className="ml-10 text-blue-500" onClick={() => handleDeleteComment(comment._id)}>
                                Delete
                            </button>
                        }

                        {/* Reply input */}
                        {showReplyInput === comment._id ? (
                            <div className="ml-10 mb-2 mt-2">
                                <Input
                                    placeholder="Add a reply"
                                    onPressEnter={(e) => handleAddReply(comment._id, e.currentTarget.value)}
                                />
                                <div className="mt-2">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={(e) => handleAddReply(comment._id, e.currentTarget.value)}>
                                        Save
                                    </button>
                                    <button className=" ml-2 text-black border py-1 px-2 rounded" onClick={() => setShowReplyInput("")}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )
                            : <button className="ml-6 text-blue-500" onClick={() => setShowReplyInput(comment._id)}>
                                Reply
                            </button>
                        }

                        {/* Replies */}
                        <div className='mt-2 ml-2'>
                            {showReplies.includes(String(comment._id)) && (
                                comment.replies.map((reply) => (
                                    <div key={reply._id} className="ml-8 mb-2">
                                        <div className="flex items-center mb-2">
                                            <Avatar icon={<UserOutlined />} src={reply.author.picture} className="mr-2 border-blue-500" />
                                            <span className="font-bold">{reply.author.name}</span>
                                            <span className="ml-2 text-gray-500">
                                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <div className="ml-10">
                                            <Popover
                                                placement="topLeft"
                                                content={<ReactionPopup reactions={reply.reactions} onSelectReaction={(emoji) => handleReaction(reply._id, emoji, true, comment._id)} />}
                                                trigger="hover"
                                            >
                                                <p className="-mt-2">{reply.content}</p>
                                            </Popover>
                                            <div className="flex items-center mb-2">
                                                {reply.reactions.map((reaction) => (
                                                    <span key={reaction._id} className="bg-blue-200 rounded-lg p-1 mr-2 cursor-pointer" onClick={() => handleReaction(reply._id, reaction.emoji, true, comment._id)}>
                                                        {reaction.emoji}
                                                    </span>
                                                ))}
                                            </div>
                                            {reply.author._id === userId &&
                                                <button className="text-blue-500" onClick={() => handleDeleteReply(comment._id, reply._id)}>
                                                    Delete
                                                </button>
                                            }
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>

                        <Divider className="my-2 border-b-1 border-gray-300" />
                    </div>
                ))}
            </div>}
        </div>
    )
}

export default Comments