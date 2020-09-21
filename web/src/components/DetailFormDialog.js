import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import DetailForm from 'react-material-final-form';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const CustomDialogTitle = ({ children, onClose, ...other }) => {
  const classes = useStyles();
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

CustomDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
};

export default function DetailFormDialog({ title = '新增資料', openOnInit = false, onClose, ...detailFormProps }) {
  const classes = useStyles();
  const [open, setOpen] = useState(openOnInit);

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth = {'sm'}
        onClose={handleClose}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        aria-labelledby="form-dialog-title"
      >
        <CustomDialogTitle id="form-dialog-titlse" onClose={handleClose}>
          {title}
        </CustomDialogTitle>
        <DialogContent className={classes.content} dividers>
          <DetailForm
            usePristine={true}
            submitButtonText={'新增'}
            submitButtonProps={{
              variant: 'contained',
              color: 'primary',
              type: 'submit',
              fullWidth: false,
            }}
            {...detailFormProps}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

DetailFormDialog.propTypes = {
  title: PropTypes.string,
  openOnInit: PropTypes.bool,
  onClose: PropTypes.func,
};
