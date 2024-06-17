




const handleDeleteButtonClick = () => {
    Swal.fire({
      title: 'Enter Password',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      preConfirm: (password) => {
        return validatePassword(password).then(isValid => {
          if (!isValid) {
            Swal.showValidationMessage('Incorrect password!');
          } else {
            return handlePasswordValidated();
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  };

  const validatePassword = async (password) => {
    try {
      const { data, error } = await supabase
        .from('PASS')
        .select('*')
        .eq('PASS', password)
        .single();

      if (error || !data) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  };

  const handlePasswordValidated = async () => {
    try {
      await CopyAndDelete();
      const response = await selectAllFromTable();
      setData(response);
      setCurrentData(response);
      resetFilters();
      Swal.fire('Success', 'Data copied and deleted successfully', 'success');
    } catch (error) {
      console.error('Error copying and deleting data:', error);
      Swal.fire('Error', 'An error occurred while deleting the data', 'error');
    }
  };