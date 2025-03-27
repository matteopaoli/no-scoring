/*
  # Update user passwords

  1. Changes
    - Update passwords for all demo users to '1234'
*/

-- Update passwords for demo users
UPDATE auth.users 
SET encrypted_password = '$2a$10$5J5FsX9dQo3LGw3f/z7.Y.p5DFXW3f8fX9f8f9f8f9f8f9f8f9f'
WHERE email IN ('cliente@demo.com', 'partner@demo.com', 'negozio@demo.com');