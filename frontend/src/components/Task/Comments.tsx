import { UserOutlined } from '@ant-design/icons'
import { Avatar, Divider, Input, Popover, Spin, message } from 'antd'
import { formatDistanceToNow } from 'date-fns'
import React, { useState } from 'react'
import { CommentType, ReactionType } from './Types/types'
import { commentAPI } from '../../Api'
import { reactionOptions } from './utils'
import { useMutation, useQuery } from 'react-query'
import useAuthStore from '../../Store/authStore'
import { useInView } from 'react-intersection-observer'

interface CommentsProps {
    taskId: string
    userId: string
}

interface ReactionPopupProps {
    reactions: { emoji: string }[];
    onSelectReaction: (emoji: string) => void;
}


const Comments = ({ taskId, userId }: CommentsProps) => {

    // for comments
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [editCommentValue, setEditCommentValue] = useState("");
    const [showEditCommentInput, setShowEditCommentInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const user = useAuthStore((state) => state.user)


    // for replies
    const [newReply, setNewReply] = useState<string>("");
    const [showReplyInput, setShowReplyInput] = useState("");

    const [editReplyValue, setEditReplyValue] = useState("");
    const [showEditReplyInput, setShowEditReplyInput] = useState("");
    const [showReplies, setShowReplies] = useState<String[]>([]);

    const { ref: commentsRef, inView } = useInView({
        threshold: 0.1, // Adjust the threshold as needed
        triggerOnce: false, // Keep triggering when the visibility changes
    });

    const { isLoading } = useQuery(
        ['comments', taskId],
        () => commentAPI.getComments(taskId),
        {
            enabled: inView, // Only fetch when the component is in view
            onSuccess: (res) => {
                setComments(res.data);
            },
            onError: (error) => {
                console.error("Error fetching comments:", error);
            },
            refetchInterval: inView ? 2000 : false, // Poll every 2 seconds only when in view
        }
    );

    const ReactionPopup: React.FC<ReactionPopupProps> = ({ reactions, onSelectReaction }) => {
        return (
            <div className="flex space-x-2 p-2 border rounded shadow-lg">
                {reactionOptions.map((emoji, index) => (
                    <span
                        key={index}
                        className="cursor-pointer text-xl transform transition-transform duration-300 hover:-translate-y-1"
                        onClick={() => onSelectReaction(emoji)}
                    >
                        {emoji}
                    </span>
                ))}
            </div>
        );
    };


    const deleteCommentMutation = useMutation(
        (commentId: string) => commentAPI.deleteComment(commentId),
        {
            onSuccess: (data, commentId) => {
                setComments((prevComments) =>
                    prevComments.filter((comment) => comment._id !== commentId)
                );
                void message.success("Comment deleted successfully", 1.5);
            },
            onError: (error) => {
                console.error("Error deleting comment:", error);
                void message.error("Error deleting comment", 1.5);
            },
        }
    );

    const handleDeleteComment = async (commentId: string) => {
        deleteCommentMutation.mutate(commentId);
    };

    const editCommentMutation = useMutation(
        ({ commentId, newContent }: { commentId: string; newContent: string }) => commentAPI.editComment(commentId, newContent),
        {
            onSuccess: (data, { commentId, newContent }) => {
                setComments((prevComments) =>
                    prevComments.map((comment) => {
                        if (comment._id === commentId) {
                            return {
                                ...comment,
                                content: newContent,
                            };
                        }
                        return comment;
                    })
                );
                void message.success("Comment edited successfully", 1.5);
            },
            onError: (error) => {
                console.error("Error editing comment:", error);
                void message.error("Error editing comment", 1.5);
            },
            onSettled: () => {
                setEditCommentValue("");
                setShowEditCommentInput("");
            }
        }
    );

    const handleEditComment = (commentId: string, newContent: string) => {
        editCommentMutation.mutate({ commentId, newContent });
    };

    const editReplyMutation = useMutation(
        ({ commentId, replyId, newContent }: { commentId: string; replyId: string; newContent: string }) =>
            commentAPI.editReply(replyId, newContent),
        {
            onSuccess: (data, { commentId, replyId, newContent }) => {
                setComments((prevComments) =>
                    prevComments.map((comment) => {
                        if (comment._id === commentId) {
                            return {
                                ...comment,
                                replies: comment.replies.map((reply) => {
                                    if (reply._id === replyId) {
                                        return {
                                            ...reply,
                                            content: newContent,
                                        };
                                    }
                                    return reply;
                                }),
                            };
                        }
                        return comment;
                    })
                );
                void message.success("Reply edited successfully", 1.5);
            },
            onError: (error) => {
                console.error("Error editing reply:", error);
                void message.error("Error editing reply", 1.5);
            },
            onSettled: () => {
                setEditReplyValue("");
                setShowEditReplyInput("");
            }
        }
    );

    const handleEditReply = (commentId: string, replyId: string, newContent: string) => {
        editReplyMutation.mutate({ commentId, replyId, newContent });
    };

    const deleteReplyMutation = useMutation(
        ({ commentId, replyId }: { commentId: string; replyId: string }) => commentAPI.deleteReply(replyId),
        {
            onSuccess: (data, { commentId, replyId }) => {
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
            },
            onError: (error) => {
                console.error("Error deleting reply:", error);
                void message.error("Error deleting reply", 1.5);
            }
        }
    );

    const handleDeleteReply = (commentId: string, replyId: string) => {
        deleteReplyMutation.mutate({ commentId, replyId });
    };

    const addCommentMutation = useMutation(
        ({ taskId, newComment, userId }: { taskId: string; newComment: string; userId: string }) => commentAPI.addComment(taskId, newComment, userId),
        {
            onSuccess: (res) => {
                setComments([...comments, res.data.comment]);
                setNewComment("");
                message.success("Comment added successfully", 1.5);
            },
            onError: (error) => {
                console.error("Error adding comment:", error);
                message.error("Error adding comment", 1.5);
            },
        }
    );

    const handleAddComment = async () => {
        if (newComment.trim() === "") {
            message.error("Comment cannot be empty", 1.5);
            return;
        }
        addCommentMutation.mutate({ taskId, newComment, userId: userId ?? "" });
    };

    const addReplyMutation = useMutation(
        ({ commentId, content, userId }: { commentId: string; content: string; userId: string }) =>
            commentAPI.addReply(commentId, content, userId),
        {
            onSuccess: (data, { commentId }) => {
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment._id === commentId
                            ? { ...comment, replies: [...comment.replies, data.data.reply] }
                            : comment
                    )
                );
                setShowReplies((prevShowReplies) => [...prevShowReplies, commentId]);
                void message.success("Reply added successfully", 1.5);
            },
            onError: (error) => {
                console.error("Error adding reply:", error);
                void message.error("Error adding reply", 1.5);
            },
            onSettled: () => {
                setNewReply("");
                setShowReplyInput("");
            }
        }
    );

    const handleAddReply = (commentId: string, content: string) => {
        if (content.trim() === "") {
            void message.error("Reply cannot be empty", 1.5);
            return;
        }
        addReplyMutation.mutate({ commentId, content, userId });
    };

    const addReactionMutation = useMutation(
        ({ commentId, emoji, isReply, parentId }: { commentId: string; emoji: string; isReply?: boolean; parentId?: string }) =>
            commentAPI.addReaction(commentId, emoji, userId),
        {
            onSuccess: (data, { commentId, emoji, isReply, parentId }) => {
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
                void message.success("Reaction added successfully", 1.5);
            },
            onError: (error) => {
                console.error("Error adding reaction:", error);
                void message.error("Error adding reaction", 1.5);
            }
        }
    );

    const handleReaction = (commentId: string, emoji: string, isReply?: boolean, parentId?: string) => {
        addReactionMutation.mutate({ commentId, emoji, isReply, parentId });
    };


    const toggleReplies = (commentId: string) => {
        setShowReplies((prevReplies) =>
            prevReplies.includes(commentId)
                ? prevReplies.filter((id) => id !== commentId)
                : [...prevReplies, commentId]
        );
    };

    return (
        <div className="mt-4" ref={commentsRef}>
            <label className="block mb-3 mt-8 font-bold text-gray-700">Comments</label>

            {/* Add comment box */}
            <div className="flex flex-col">
                <Input.TextArea
                    placeholder="Add a comment"
                    value={newComment}
                    onPressEnter={handleAddComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                // onKeyDown={handleTyping}
                // onBlur={handleStopTyping}
                />
                <button disabled={addCommentMutation.isLoading} onClick={handleAddComment} className="w-[130px] mt-2 my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded">
                    Add Comment
                </button>
                {isTyping && <span className="text-sm text-gray-500">{user?.name} Typing...</span>}
            </div>

            {/* mapping over all comments */}
            <Spin spinning={isLoading} tip="Loading Comments..." className="mt-4 mb-8">
                {comments.length > 0 && <div className="border-2 p-4 rounded">
                    {comments.map((comment) => (
                        <div key={comment._id} className="mb-4">

                            {/* profile picture, name and time */}
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

                            {/* bottom buttons of comment */}
                            {/* 1. show/hide replies button */}
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

                            {/* Edit and reply comment button */}
                            {comment.author._id === userId && showEditCommentInput !== comment._id && <button className="ml-8 text-blue-500" onClick={() => { setEditCommentValue(comment.content); setShowEditCommentInput(comment._id); setShowReplyInput("") }}>
                                Edit
                            </button>}

                            {showReplyInput !== comment._id && <button className="ml-10 text-blue-500" onClick={() => { setShowReplyInput(comment._id); setShowEditCommentInput("") }}>
                                Reply
                            </button>}



                            {/* Edit comment input */}
                            {comment.author._id === userId && showEditCommentInput === comment._id && (
                                <div className="ml-10 mb-2 mt-2">
                                    <Input
                                        placeholder="Edit comment"
                                        value={editCommentValue}
                                        onChange={(e) => setEditCommentValue(e.target.value)}
                                        onPressEnter={(e) => handleEditComment(comment._id, e.currentTarget.value)}
                                    />
                                    <div className="mt-2">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={() => { handleEditComment(comment._id, editCommentValue); }}>
                                            Save
                                        </button>
                                        <button className=" ml-2 text-black border py-1 px-2 rounded" onClick={() => { setShowEditCommentInput(""); setEditCommentValue(""); }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}


                            {/* add reply input */}
                            {showReplyInput === comment._id && (
                                <div className="ml-10 mb-2 mt-2">
                                    <Input
                                        placeholder="Add a reply"
                                        onChange={(e) => setNewReply(e.target.value)}
                                        onPressEnter={(e) => handleAddReply(comment._id, e.currentTarget.value)}
                                    />
                                    <div className="mt-2">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={(e) => handleAddReply(comment._id, newReply)}>
                                            Save
                                        </button>
                                        <button className=" ml-2 text-black border py-1 px-2 rounded" onClick={() => { setShowReplyInput(""); setNewReply(""); }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Replies */}
                            <div className='mt-2 ml-2'>
                                {showReplies.includes(String(comment._id)) && (
                                    comment.replies.map((reply) => (
                                        <div key={reply._id} className="ml-8 mb-2 bg-slate-100 p-2 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <Avatar icon={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} src={reply.author.picture} className="mr-2 border-blue-500" />
                                                <span className="font-bold">{reply.author.name}</span>
                                                <span className="ml-2 text-gray-500">
                                                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <div className="ml-10">

                                                {/* reply, emojis for replies */}
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


                                                {/* Edit and delete for reply buttons */}
                                                {/* delete reply */}
                                                {reply.author._id === userId &&
                                                    <button className="text-blue-500 " onClick={() => handleDeleteReply(comment._id, reply._id)}>
                                                        Delete
                                                    </button>
                                                }

                                                {/* edit reply */}
                                                {reply.author._id === userId && (showEditReplyInput === reply._id ? (
                                                    <div className="mb-2 mt-2">
                                                        <Input
                                                            placeholder="Edit comment"
                                                            value={editReplyValue}
                                                            onChange={(e) => setEditReplyValue(e.target.value)}
                                                            onPressEnter={(e) => handleEditReply(comment._id, reply._id, e.currentTarget.value)}
                                                        />
                                                        <div className="mt-2">
                                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={() => { handleEditReply(comment._id, reply._id, editReplyValue); }}>
                                                                Save
                                                            </button>
                                                            <button className=" ml-2 text-black border py-1 px-2 rounded" onClick={() => { setShowEditReplyInput(""); setEditReplyValue(""); }}>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                                    : <button className="text-blue-500 ml-6" onClick={() => { setEditReplyValue(reply.content); setShowEditReplyInput(reply._id) }}>
                                                        Edit
                                                    </button>)
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
            </Spin>
        </div>
    )
}

export default Comments