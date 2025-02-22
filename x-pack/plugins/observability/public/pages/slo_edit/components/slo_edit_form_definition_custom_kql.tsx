/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect } from 'react';
import { EuiButtonEmpty, EuiFlexGroup, EuiFlexItem, EuiFormLabel, EuiSuggest } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { Control, Controller, UseFormTrigger } from 'react-hook-form';
import type { CreateSLOInput } from '@kbn/slo-schema';

import { useFetchIndices } from '../../../hooks/use_fetch_indices';

export interface Props {
  control: Control<CreateSLOInput>;
  trigger: UseFormTrigger<CreateSLOInput>;
}

export function SloEditFormDefinitionCustomKql({ control, trigger }: Props) {
  const { loading, indices = [] } = useFetchIndices();

  const indicesNames = indices.map(({ name }) => ({
    type: { iconType: '', color: '' },
    label: name,
    description: '',
  }));

  // Indices are loading in asynchrously, so trigger field validation
  // once results are returned from API
  useEffect(() => {
    if (!loading && indices.length) {
      trigger();
    }
  }, [indices.length, loading, trigger]);

  function valueMatchIndex(value: string | undefined, index: string): boolean {
    if (value === undefined) {
      return false;
    }

    if (value.length > 0 && value.substring(value.length - 1) === '*') {
      return index.indexOf(value.substring(0, value.length - 1), 0) > -1;
    }

    return index === value;
  }

  return (
    <EuiFlexGroup direction="column" gutterSize="l">
      <EuiFlexItem>
        <EuiFormLabel>
          {i18n.translate('xpack.observability.slos.sloEdit.sloDefinition.customKql.index', {
            defaultMessage: 'Index',
          })}
        </EuiFormLabel>

        <Controller
          name="indicator.params.index"
          control={control}
          rules={{
            required: true,
            validate: (value) => indices.some((index) => valueMatchIndex(value, index.name)),
          }}
          render={({ field, fieldState }) => (
            <EuiSuggest
              fullWidth
              isClearable
              aria-label="Indices"
              data-test-subj="sloFormCustomKqlIndexInput"
              status={loading ? 'loading' : field.value ? 'unchanged' : 'unchanged'}
              onItemClick={({ label }) => {
                field.onChange(label);
              }}
              isInvalid={
                fieldState.isDirty &&
                !indicesNames.some((index) => valueMatchIndex(field.value, index.label))
              }
              placeholder={i18n.translate(
                'xpack.observability.slos.sloEdit.sloDefinition.customKql.index.selectIndex',
                {
                  defaultMessage: 'Select an index',
                }
              )}
              suggestions={indicesNames}
              {...field}
            />
          )}
        />
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiFormLabel>
          {i18n.translate('xpack.observability.slos.sloEdit.sloDefinition.customKql.queryFilter', {
            defaultMessage: 'Query filter',
          })}
        </EuiFormLabel>
        <Controller
          name="indicator.params.filter"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <EuiSuggest
              append={<EuiButtonEmpty>KQL</EuiButtonEmpty>}
              status="unchanged"
              aria-label="Filter query"
              data-test-subj="sloFormCustomKqlFilterQueryInput"
              placeholder={i18n.translate(
                'xpack.observability.slos.sloEdit.sloDefinition.customKql.customFilter',
                {
                  defaultMessage: 'Custom filter to apply on the index',
                }
              )}
              suggestions={[]}
              {...field}
            />
          )}
        />
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiFormLabel>
          {i18n.translate('xpack.observability.slos.sloEdit.sloDefinition.customKql.goodQuery', {
            defaultMessage: 'Good query',
          })}
        </EuiFormLabel>
        <Controller
          name="indicator.params.good"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <EuiSuggest
              append={<EuiButtonEmpty>KQL</EuiButtonEmpty>}
              status="unchanged"
              aria-label="Good filter"
              data-test-subj="sloFormCustomKqlGoodQueryInput"
              placeholder={i18n.translate(
                'xpack.observability.slos.sloEdit.sloDefinition.customKql.goodQueryPlaceholder',
                {
                  defaultMessage: 'Define the good events',
                }
              )}
              suggestions={[]}
              {...field}
            />
          )}
        />
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiFormLabel>
          {i18n.translate('xpack.observability.slos.sloEdit.sloDefinition.customKql.totalQuery', {
            defaultMessage: 'Total query',
          })}
        </EuiFormLabel>
        <Controller
          name="indicator.params.total"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <EuiSuggest
              append={<EuiButtonEmpty>KQL</EuiButtonEmpty>}
              status="unchanged"
              aria-label="Total filter"
              data-test-subj="sloFormCustomKqlTotalQueryInput"
              placeholder={i18n.translate(
                'xpack.observability.slos.sloEdit.sloDefinition.customKql.totalQueryPlaceholder',
                {
                  defaultMessage: 'Define the total events',
                }
              )}
              suggestions={[]}
              {...field}
            />
          )}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
