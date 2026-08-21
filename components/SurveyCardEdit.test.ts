import { Survey } from '@/model/survey';
import { applySurveyDefaults } from './SurveyCardEdit';

const original: Survey = {
  id: 1,
  title: '原问卷',
  badge: '',
  description: '',
  image: '',
  start_date: '2026-08-21T00:00:00.000Z',
  end_date: '2026-08-22T00:00:00.000Z',
  allow_submit: true,
  allow_view: true,
  allow_judge: false,
  allow_re_submit: false,
};

describe('applySurveyDefaults', () => {
  it('始终将已弃用的 allow_judge 设置为 true', () => {
    const result = applySurveyDefaults({
      ...original,
      title: '新标题',
      allow_re_submit: true,
    });

    expect(result.title).toBe('新标题');
    expect(result.allow_re_submit).toBe(true);
    expect(result.allow_judge).toBe(true);
  });
});
