import { Position, Toaster } from '@blueprintjs/core';

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP,
});

export const showToast = (message, intent = 'danger') => {
  AppToaster.show({ message, intent });
};
