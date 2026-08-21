import { screen } from '@testing-library/react';
import { render, userEvent } from '@/test-utils';
import AboutPage from './page';

describe('AboutPage', () => {
  it('展示贡献者分组并可查看详情', async () => {
    const user = userEvent.setup();
    render(<AboutPage />);

    expect(screen.getByRole('heading', { name: '关于我们' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '🔧 开发' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '✍️ 题目编写' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '🏢 组织' })).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: /查看详情/ })[0]);
    expect(await screen.findByRole('heading', { name: 'zrll_' })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/zrll12'
    );
  });
});
