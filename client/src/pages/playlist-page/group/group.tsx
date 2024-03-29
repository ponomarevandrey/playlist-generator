import React from "react";
import {
  FaChevronUp,
  FaChevronDown,
  FaArrowDown,
  FaArrowUp,
  FaRegTrashAlt,
} from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { Controller, useForm, FormProvider } from "react-hook-form";
import Select from "react-select";
import { GrCircleInformation } from "react-icons/gr";

import { useGlobalState } from "../../../hooks/use-global-state";
import { OptionsList, SavedFilterFormValues } from "../../../types";
import { Direction } from "../../../hooks/use-global-state/use-playlist-extended";
import { useSavedFilters } from "../../../hooks/use-saved-filters";
import { Playlist } from "../../../lib/playlist/playlist";
import { CHOOSE_FILTER_FORM_ID } from "../../../config/constants";
import { Modal } from "../../../lib/modal/modal";
import { SavedFilterBody } from "../../../lib/saved-filter-body/saved-filter-body";

import "./group.scss";

interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  groupId: number;
  index: number;
}

type SavedFilter = { filterId: { label: string; value: string } };

// const renderCount = 0;

export function Group(props: GroupProps) {
  const { playlist } = useGlobalState();

  const savedFilters = useSavedFilters();
  const options = Object.entries(savedFilters.state).map(([id, formValues]) => {
    return { label: formValues.name, value: id };
  });
  const form = useForm<SavedFilter>({
    defaultValues: { filterId: options[0] },
    mode: "onSubmit",
    shouldUnregister: false,
  });

  const watchedInput = form.watch("filterId.value");

  function handleSubmit(formValues: { filterId: OptionsList<string> }) {
    playlist.handleTrackAdd(
      props.groupId,
      savedFilters.state[formValues.filterId.value],
    );
  }

  function handleResubmit(formValues: SavedFilterFormValues, trackId: number) {
    playlist.handleTrackReplace({
      groupId: props.groupId,
      trackId,
      formValues: savedFilters.state[formValues.filterId.value],
    });
  }

  function handleTrackRemove(trackId: number) {
    playlist.handleTrackRemove(props.groupId, trackId);
  }

  function handleTrackReorder({
    index,
    direction,
  }: {
    index: number;
    direction: Direction;
  }) {
    playlist.handleTrackReorder({ index, direction, groupId: props.groupId });
  }

  return (
    <>
      <div className="group">
        <header
          className="group__header"
          role="presentation"
          onClick={(e) => {
            e.stopPropagation();
            playlist.handleGroupOpenToggle(props.groupId);
          }}
        >
          <span className="group__index">{props.index + 1}</span>
          <div className="group__name">
            <form
              className={`group__saved-filters-form ${props.className || ""}`}
              onSubmit={form.handleSubmit(handleSubmit)}
              onClick={(e) => e.stopPropagation()}
              id={`${CHOOSE_FILTER_FORM_ID}-${props.groupId}`}
            >
              <Controller
                name="filterId"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="group__select"
                    options={options}
                    onInputChange={() =>
                      playlist.handleTracksReset(props.groupId)
                    }
                  />
                )}
              />
            </form>
          </div>
          <div className="group__toggle-group-btn">
            {playlist.isGroupOpen[`${props.groupId}`] ? (
              <FaChevronUp className="icon" />
            ) : (
              <FaChevronDown className="icon" />
            )}
          </div>
          <span></span>
          <div
            className="group__header-btns"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <Modal
              title={savedFilters.state[watchedInput].name}
              activator={({ setIsVisible }) => (
                <button
                  type="button"
                  onClick={() => {
                    setIsVisible(true);
                  }}
                  className="btn btn_type_icon btn_hover_grey-20"
                >
                  <GrCircleInformation className="icon" />
                </button>
              )}
            >
              <SavedFilterBody filter={savedFilters.state[watchedInput]} />
            </Modal>
            <button
              type="button"
              onClick={() => {
                playlist.handleGroupRemove(props.groupId);
              }}
              className="btn btn_type_icon btn_hover_grey-20"
            >
              <span>
                <FaRegTrashAlt className="icon" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                playlist.handleGroupReorder(props.index, "UP");
              }}
              className="btn btn_type_icon btn_hover_grey-20 group__sort-btn"
            >
              <FaArrowUp className="icon" />
            </button>
            <button
              type="button"
              onClick={() => {
                playlist.handleGroupReorder(props.index, "DOWN");
              }}
              className="btn btn_type_icon btn_hover_grey-20 group__sort-btn"
            >
              <FaArrowDown className="icon" />
            </button>
          </div>
        </header>

        <div
          className={`group__body ${
            playlist.isGroupOpen[`${props.groupId}`] ? "" : "group__body_hidden"
          }`}
        >
          <FormProvider {...form}>
            <Playlist
              className="group__playlist"
              formId={`${CHOOSE_FILTER_FORM_ID}-${props.groupId}`}
              groupId={props.groupId}
              onResubmit={handleResubmit}
              tracks={playlist.tracks[`${props.groupId}`]}
              onRemoveTrack={handleTrackRemove}
              onReorderTracks={handleTrackReorder}
            />
          </FormProvider>
          <button
            name="findtrack"
            type="submit"
            disabled={false}
            form={`${CHOOSE_FILTER_FORM_ID}-${props.groupId}`}
            className="btn btn_type_primary group__find-track-btn"
          >
            Add Track
          </button>
        </div>
      </div>
      <button
        type="button"
        className="btn btn_type_secondary"
        onClick={() => playlist.handleGroupAdd(props.index + 1)}
      >
        <IoMdAddCircle className="icon" />
        <span>Add Group</span>
      </button>
    </>
  );
}
