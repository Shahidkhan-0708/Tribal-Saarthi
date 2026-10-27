import { expect,it } from 'vitest';
import { csv } from './exports';
it('exports multiline quotes and neutralizes spreadsheet formulas',() => {
  expect(csv(['name','value'],[['a,"b\nc', '=HYPERLINK("bad")'],[' @SUM(1)',null]])).toBe('"name","value"\r\n"a,""b\nc","\'=HYPERLINK(""bad"")"\r\n"\' @SUM(1)",""');
});
