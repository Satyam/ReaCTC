// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import without from 'lodash/without';
import isPlainClick from '_utils/isPlainClick';
import { Helmet } from 'react-helmet';

import { BrowseButton, Button } from 'react-toolbox/lib/button';
import { List, ListCheckbox } from 'react-toolbox/lib/list';
import { Navigation } from 'react-toolbox/lib/navigation';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import { FontIcon } from 'react-toolbox/lib/font_icon';

import { sectorListEntryShape, sectoresListShape } from '_components/shapes';

import styles from './styles.css';

export function Sector({
  sector,
  checked,
  onChange,
}: {
  sector: SectorListEntry,
  checked: boolean,
  onChange: (IdType, boolean) => void,
}) {
  function onChangeHandler(mark) {
    onChange(sector.idSector, mark);
  }
  return (
    <ListCheckbox
      caption={sector.descrCorta}
      legend={sector.descr}
      checked={checked}
      onChange={onChangeHandler}
    />
  );
}

Sector.propTypes = {
  sector: sectorListEntryShape,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

const icons = {
  normal: 'check',
  warn: 'warning',
  error: 'error',
};

export default class AdminSectoresComponent extends Component<
  {
    sectores: SectorListEntry[],
    status: AdminStatusItem[],
    onDeleteSectores: (IdType[]) => void,
    onUploadSector: string => void,
    onClearStatusAdmin: void => void,
  },
  {
    delList: IdType[],
  }
> {
  constructor(...args: Array<any>) {
    super(...args);
    this.state = { delList: [] };
  }
  onChangeHandler = (idSector: string, checked: boolean) => {
    const list = this.state.delList;
    this.setState({ delList: checked ? list.concat(idSector) : without(list, idSector) });
  };
  onDeleteHandler = () => {
    this.props.onDeleteSectores(this.state.delList);
    this.setState({ delList: [] });
  };
  onUploadHandler = (ev: SyntheticInputEvent<>) => {
    ev.stopPropagation();
    const file: string = ev.target.files.item[0];
    if (file) {
      this.props.onUploadSector(file);
    }
  };
  onClearStatusHandler = (ev: KeyboardEvent) => {
    if (isPlainClick(ev)) {
      this.props.onClearStatusAdmin();
    }
  };
  render() {
    const delList = this.state.delList;
    const { sectores, status } = this.props;
    if (!sectores) return null;
    return (
      <div>
        <Helmet>
          <title>Admin Sectores</title>
        </Helmet>
        <div className={styles.form}>
          <List className={styles.list}>
            {sectores.map(sector => (
              <Sector
                key={sector.idSector}
                sector={sector}
                checked={delList.indexOf(sector.idSector) > -1}
                onChange={this.onChangeHandler}
              />
            ))}
          </List>
          <Navigation className={styles.buttons}>
            <BrowseButton
              raised
              label="Agregar"
              icon="file_upload"
              name="archivo"
              accept=".json"
              onChange={this.onUploadHandler}
            />
            <Button
              label="Delete"
              name="delete"
              icon="delete"
              disabled={delList.length === 0}
              raised
              onClick={this.onDeleteHandler}
            />
          </Navigation>
        </div>
        {(status.length || null) && (
          <div>
            <Table selectable={false}>
              <TableHead>
                <TableCell>Nivel</TableCell>
                <TableCell>Dónde</TableCell>
                <TableCell>Mensaje</TableCell>
              </TableHead>
              {status.map(row => (
                <TableRow className={styles[row.nivel]}>
                  <TableCell>
                    <FontIcon value={icons[row.nivel]} />
                  </TableCell>
                  <TableCell>{row.entity}</TableCell>
                  <TableCell>{row.message}</TableCell>
                </TableRow>
              ))}
            </Table>
            <Button label="Limpiar" icon="delete" raised onClick={this.onClearStatusHandler} />
          </div>
        )}
      </div>
    );
  }
}

AdminSectoresComponent.propTypes = {
  sectores: sectoresListShape,
  status: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      entity: PropTypes.string,
      message: PropTypes.string,
    })
  ),
  onDeleteSectores: PropTypes.func,
  onUploadSector: PropTypes.func,
  onClearStatusAdmin: PropTypes.func,
};
