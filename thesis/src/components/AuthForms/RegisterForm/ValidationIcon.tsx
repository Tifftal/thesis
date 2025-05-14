import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';

type Props = {
  isValid: boolean;
};

export const ValidationIcon = (props: Props) => {
  const { isValid } = props;

  return isValid ? (
    <IconCircleCheck color='var(--color-green-main)' width={20} height={20} stroke={1.2} />
  ) : (
    <IconCircleX color='var(--color-red)' width={20} height={20} stroke={1.2} />
  );
};
