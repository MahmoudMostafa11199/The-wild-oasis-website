import React from 'react';

function UserAvatar({ name }: { name?: string | null }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
    : 'G';

  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-sm font-semibold">
      {initials.toUpperCase()}
    </div>
  );
}

export default UserAvatar;
