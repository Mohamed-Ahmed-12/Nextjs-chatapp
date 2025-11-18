import React from 'react'
import ContentLoader, { IContentLoaderProps } from 'react-content-loader'

// Re-use the basic ChatSkelton structure for a single item
const SingleChatSkelton = (props: React.JSX.IntrinsicAttributes & IContentLoaderProps & { rtl?: boolean }) => {
  // Use a default height/width if not using the 'ChatListSkelton' wrapper
  const width = props.width ?? 350; // Example default width
  const height = props.height ?? 60; // Example default height

  return (
    <ContentLoader height={height} width={width} {...props} >
      <circle cx="50" cy="45" r="16" />
      {/* Rectangles remain the same, their position defines the 'message' */}
      <rect x="80" y="50" rx="5" ry="5" width="220" height="10" />
      <rect x="80" y="29" rx="5" ry="5" width="220" height="10" />
    </ContentLoader>
  )
}

/**
 * Renders a list of alternating chat skeleton loaders.
 * @param count The number of chat skeletons to render.
 */
interface ChatListSkeltonProps extends IContentLoaderProps {
    count?: number;
}

const ChatListSkelton = ({ count = 8, ...props }: ChatListSkeltonProps) => {
    const skeletons = Array.from({ length: count }, (_, index) => (
        <div key={index} style={{ marginBottom: '10px' }}> {/* Add spacing between items */}
            <SingleChatSkelton width={"100%"} rtl={index % 2 !== 0} {...props} />
        </div>
    ));

    return <>{skeletons}</>;
};

export default ChatListSkelton;