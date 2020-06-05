import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";

import {RenderPosition, render, replace} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export default class PointController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._pointEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  render(point) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point);

    this._pointComponent.setEditBtnClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._pointEditComponent.setFavouriteBtnClickHandler(() => {
      this._dataChangeHandler(this, point, Object.assign({}, point, {
        isFavourite: !point.isFavourite,
      }));
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this._replaceEditToPoint();
    });

    this._pointEditComponent.setCloseBtnClickHandler(() => {
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this._replaceEditToPoint();
    });

    if (oldPointComponent && oldPointEditComponent) {
      replace(this._pointComponent, oldPointComponent);
      replace(this._pointEditComponent, oldPointEditComponent);
    } else {
      render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replaceEditToPoint() {
    this._pointEditComponent.reset();
    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    this._viewChangeHandler();
    replace(this._pointEditComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _escKeyDownHandler(evt) {
    const isEsc = evt.key === `Escape` || evt.key === `Esc`;
    if (isEsc) {
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
