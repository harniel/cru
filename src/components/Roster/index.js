import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Toolbar,
  Scheduler,
  WeekView,
  DateNavigator,
  Appointments,
  AppointmentTooltip,
  TodayButton,
  DayView,
  ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";
import moment from "moment";
import { Grid, styled } from "@mui/material";
import { FreeBreakfast } from "@mui/icons-material";
import classNames from "clsx";

import { appointments } from "../../demo-data/appointments";
import shift from "../../data/shifts.json";
import employees from "../../data/employees.json";
import roles from "../../data/roles.json";

const PREFIX = "cru";

const classes = {
  icon: `${PREFIX}-icon`,
  textCenter: `${PREFIX}-textCenter`,
  header: `${PREFIX}-header`,
  sevenEleven: `${PREFIX}-sevenEleven`,
  commandButton: `${PREFIX}-commandButton`,
};

// APPOINTMENT COMPONENTS
const Appointment = ({ children, style, ...restProps }) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: restProps.data.backgroundColor,
    }}
  >
    {children}
  </Appointments.Appointment>
);

const AppointmentContent = ({ data, ...restProps }) => (
  <Appointments.AppointmentContent
    {...restProps}
    data={data}
    style={{
      color: data.textColor,
    }}
  >
    {restProps.children}
  </Appointments.AppointmentContent>
);

// TOOLTIP COMPONENTS
const Header = ({ children, appointmentData, ...restProps }) => (
  <StyledAppointmentTooltipHeader
    {...restProps}
    className={classNames(classes.sevenEleven, classes.header)}
    appointmentData={appointmentData}
  ></StyledAppointmentTooltipHeader>
);

const StyledAppointmentTooltipHeader = styled(AppointmentTooltip.Header)(
  () => ({
    [`&.${classes.sevenEleven}`]: {
      background:
        "url(https://pangrampangram.com/cdn/shop/articles/711-cover_1_1920x.jpg?v=1648129702)",
    },
    [`&.${classes.header}`]: {
      height: "260px",
      backgroundSize: "cover",
    },
  })
);

const StyledGrid = styled(Grid)(() => ({
  [`&.${classes.textCenter}`]: {
    textAlign: "center",
  },
}));

const StyledIcon = styled(FreeBreakfast)(({ theme: { palette } }) => ({
  [`&.${classes.icon}`]: {
    color: palette.action.active,
  },
}));

const AppointmentTooltipContent = ({
  children,
  appointmentData,
  ...restProps
}) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <Grid container alignItems="center">
      <StyledGrid item xs={2} className={classes.textCenter}>
        <StyledIcon className={classes.icon} />
      </StyledGrid>
      <Grid item xs={10}>
        <span>{appointmentData.break / 60} mins Break</span>
      </Grid>
    </Grid>
  </AppointmentTooltip.Content>
);

function Roster() {
  const [data, setData] = useState(appointments);
  const [currentDate, setCurrentDate] = useState("2018-06-18");

  const currentDateChange = (currentDate) => {
    setCurrentDate(currentDate);
  };

  const formatData = (shift) => {
    const formattedData = shift.map((shift) => {
      const employee = employees.find(
        (employee) => employee.id === shift.employee_id
      );
      const role = roles.find((role) => role.id === shift.role_id);

      const title = `${employee.first_name} ${employee.last_name} - ${role.name}`;

      return {
        title: title,
        startDate: moment(shift.start_time).format("YYYY-MM-DDTHH:mm:ss"),
        endDate: moment(shift.end_time).format("YYYY-MM-DDTHH:mm:ss"),
        id: shift.id,
        backgroundColor: role.background_colour,
        textColor: role.text_colour,
        break: shift.break_duration,
      };
    });

    return formattedData;
  };

  useEffect(() => {
    setData(formatData(shift));
  }, []);

  return (
    <Paper>
      <Scheduler data={data} height={660}>
        <ViewState
          currentDate={currentDate}
          defaultCurrentViewName="Week"
          onCurrentDateChange={currentDateChange}
        />
        <DayView startDayHour={0} endDayHour={24} cellDuration={60} />
        <WeekView
          startDayHour={0}
          endDayHour={24}
          intervalCount={1}
          cellDuration={60}
        />
        <Toolbar />
        <ViewSwitcher />
        <DateNavigator />
        <TodayButton />
        <Appointments
          appointmentComponent={Appointment}
          appointmentContentComponent={AppointmentContent}
        />
        <AppointmentTooltip
          headerComponent={Header}
          contentComponent={AppointmentTooltipContent}
          //   commandButtonComponent={CommandButton}
          showCloseButton
        />
      </Scheduler>
    </Paper>
  );
}

export default Roster;
