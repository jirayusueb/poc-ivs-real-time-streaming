import React from 'react'

/**
 * Render a placeholder component with a user ID.
 *
 * @param {Object} props - The component props.
 * @param {string} props.userId - The user ID to display.
 * @returns {JSX.Element} The Placeholder component.
 */
function Placeholder({ userId }: { userId: string }): JSX.Element {
  return (
    <div>
      <span>{userId}</span>
    </div>
  )
}

export default Placeholder
