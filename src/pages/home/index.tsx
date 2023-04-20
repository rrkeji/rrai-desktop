
import { setLocalValue } from '@/utils';
import { useEffect } from 'react';
import { history, useLocation } from 'umi';

export default function HomePage() {

  useEffect(() => {
    setLocalValue('rrai_active_menu', 'chat');
    history.push('/conversation/chat');
  }, []);

  return (
    <div>
    </div>
  );
}
